
const redis = require('../utils/redis');
const bcrypt = require('bcrypt')
const createChannel = require('../services/emailQueue');
const otpcreateChannel = require('../services/otpQueue');
const crypto = require("crypto");
const logger = require('../utils/logger');
const userModel = require('../models/user.model');

const ACCESS_TOKEN_EXPIRY_SECONDS = 300;
const REFRESH_TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7;


module.exports.registerUser = async (req, res) => {
    try {
        console.log('hello req.file:', req.file);
        console.log('hello req.body:', req.body);

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            logger.warn("Registration attempt with missing fields", { body: req.body });
            return res.status(400).json({ message: "All fields are required" });
        }

        const isExists = await userModel.findOne({ $or: [{ email }, { username }] }).lean();
        if (isExists) {

            logger.info(`Registration attempt for existing user: ${email} or ${username}`);
            return res.status(409).json({ message: "User already exists with this email or username" });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        logger.info(`Generated OTP ${otp} for ${email}`);

        const hashPassword = await bcrypt.hash(password, 10);

        const otpData = JSON.stringify({ otp, username, hashPassword });
        await redis.set(`otp:${email}`, otpData, 'EX', 300);

        const channel = await createChannel();
        if (channel) {
            channel.sendToQueue('emailQueue', Buffer.from(JSON.stringify({ email, otp })));
            logger.info(`Email task queued for ${email}`);
        } else {
            logger.error("Failed to get RabbitMQ channel for emailQueue");
        }


        console.log('Sending successful response');
        res.status(200).json({
            email,
            message: "OTP sent successfully. Please verify."
        });

    } catch (error) {
        console.error('Error in registerUser:', error);
        logger.error("Error in user registration:", { error: error.message, stack: error.stack });

        console.log('Sending error response');
        res.status(500).json({ message: "Error during user registration", error: error.message });
    }
};


module.exports.verfifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!otp || !email) {
            logger.warn("OTP verification attempt with missing fields", { body: req.body });
            return res.status(400).json({ message: "OTP and email are required" });
        }


        const storedOtpDataJson = await redis.get(`otp:${email}`);
        if (!storedOtpDataJson) {
            logger.warn(`No OTP data found in Redis for ${email}`);

            return res.status(400).json({ message: "OTP expired or invalid request. Please register again." });
        }

        const storedOtpData = JSON.parse(storedOtpDataJson);
        if (storedOtpData.otp !== otp) {
            logger.warn(`Invalid OTP received for ${email}. Expected: ${storedOtpData.otp}, Received: ${otp}`);
            // Return error immediately - DO NOT QUEUE
            return res.status(400).json({ message: "Invalid OTP entered." });
        }

        const requestId = crypto.randomUUID();
        logger.info(`Initiating OTP verification for ${email} with RequestID: ${requestId}`);

        const channel = await otpcreateChannel();
        if (channel) {

            channel.sendToQueue(
                "otpVerificationQueue",
                Buffer.from(JSON.stringify({ email, otp, requestId }))
            );
            logger.info(`OTP verification task queued for ${email}, RequestID: ${requestId}`);
        } else {
            logger.error("Failed to get RabbitMQ channel for otpVerificationQueue");
            return res.status(500).json({ message: "Could not initiate OTP verification process" });
        }


        return res.status(202).json({
            message: "Verifying OTP .",
            requestId: requestId
        });

    } catch (error) {
        logger.error("Error initiating OTP verification:", { error: error.message, stack: error.stack });
        return res.status(500).json({ message: "Error during OTP verification process" });
    }
};
module.exports.getOtpStatus = async (req, res) => {
    const { requestId } = req.query;

    if (!requestId) {
        logger.warn("OTP status request missing requestId");
        return res.status(400).json({ message: "Request ID query parameter is required" });
    }

    try {
        logger.debug(`Polling status for RequestID: ${requestId}`);

        const statusData = await redis.get(`status:${requestId}`);
        console.log(statusData)
        if (!statusData) {

            logger.debug(`No status found yet for RequestID: ${requestId}`);
            return res.status(202).json({
                statusData,
                status: "pending",
                message: "OTP verification is still in progress or request ID is invalid/expired."
            });
        }


        logger.info(`Returning status for RequestID: ${requestId}: ${statusData}`);
        const status = JSON.parse(statusData);



        return res.status(200).json(status);

    } catch (error) {
        logger.error("Error fetching OTP status:", { requestId, error: error.message, stack: error.stack });
        return res.status(500).json({ message: "Error fetching OTP status" });
    }
};


module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

       

        const user = await userModel.findOne({ email });

        

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials....",
            });
        }


        const isMatch = await user.comparePassoword(password);
      
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials..........",
            });
        }

        const accessToken = await user.accessToken();
        const refreshToken = await user.refershToken();
        const userIdString = user._id.toString();


        const userRefreshTokensKey = `user:${userIdString}:refreshTokens`;
        const refreshTokenKey = `refreshtoken:${refreshToken}`;


        const pipeline = redis.pipeline();

        pipeline.set(refreshTokenKey, userIdString, 'EX', REFRESH_TOKEN_EXPIRY_SECONDS);

        pipeline.sadd(userRefreshTokensKey, refreshToken);

        pipeline.expire(userRefreshTokensKey, REFRESH_TOKEN_EXPIRY_SECONDS + 300);
        await pipeline.exec();



        const userResponse = {
            _id: user._id,
            email: user.email,

        };


        return res.status(200).json({
            message: "User logged in successfully.",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: userResponse
        });

    } catch (error) {
        console.log("Login Error:", error);
        return res.status(500).json({
            message: error,

        });
    }
};



module.exports.logoutUser = async (req, res) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        
         logger.info("Logout request without token, assuming logged out.");
         return res.status(200).json({ message: "No token provided, assumed logged out." });
       
    }

    const accessToken = authHeader.split(" ")[1];
    let userIdFromToken = null;

    try {
       
        try {
           
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
            if (decoded && decoded._id) {
                userIdFromToken = decoded._id;
                logger.info(`Logout initiated by user ${userIdFromToken} (valid token).`);
            } else {
                 logger.warn("Logout: Token verified but no _id found in payload:", decoded);
            }
        } catch (verificationError) {
          
            if (verificationError.name === 'TokenExpiredError' || verificationError.name === 'JsonWebTokenError') {
                logger.warn(`Logout: Access Token verification failed: ${verificationError.message}. Trying to decode...`);
                try {
                    const potentiallyExpiredDecoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN, { ignoreExpiration: true });
                    if (potentiallyExpiredDecoded && potentiallyExpiredDecoded._id) {
                        userIdFromToken = potentiallyExpiredDecoded._id;
                        logger.info(`Logout: Identified user ${userIdFromToken} from expired/invalid token for cleanup.`);
                    } else {
                         logger.warn("Logout: Could not extract _id even from decoded expired/invalid token.");
                    }
                } catch (decodeError) {
                    logger.error("Logout: Could not decode the invalid/expired token at all:", decodeError.message);
                }
            } else {
                 
                 logger.error("Logout: Unexpected Access Token Verification Error:", verificationError);
            }
            
        }

       
        if (userIdFromToken) {
            const userIdString = userIdFromToken.toString();
            const userRefreshTokensKey = `user:${userIdString}:refreshTokens`;
            logger.info(`Logout: Attempting to clear refresh tokens for user ${userIdString}`);

            try {
                const userRefreshTokens = await redis.smembers(userRefreshTokensKey);

                if (userRefreshTokens && userRefreshTokens.length > 0) {
                    const pipeline = redis.pipeline();
                  
                    const refreshKeysToDelete = userRefreshTokens.map(token => `refreshtoken:${token}`);

                    if (refreshKeysToDelete.length > 0) {
                        pipeline.del(refreshKeysToDelete); 
                        logger.debug(`Logout: Pipeline: Deleting ${refreshKeysToDelete.length} refresh token keys for user ${userIdString}`);
                    }
                    pipeline.del(userRefreshTokensKey); 
                    logger.debug(`Logout: Pipeline: Deleting user refresh token set key ${userRefreshTokensKey}`);

                    await pipeline.exec();
                    logger.info(`Logout: Refresh tokens cleared successfully from Redis for user ${userIdString}`);
                } else {
                    logger.info(`Logout: No active refresh tokens found in Redis set for user ${userIdString}. Nothing to clear.`);
                    
                }
            } catch (redisError) {
                logger.error(`Logout: Redis error during refresh token cleanup for user ${userIdString}:`, redisError);
                
            }
        } else {
            logger.warn("Logout: Could not identify user from token, skipping refresh token cleanup in Redis.");
        }

        
        try {
            const blacklistedAccessTokenKey = `blacklisted:accessToken:${accessToken}`;
            
            await redis.set(blacklistedAccessTokenKey, '1', 'EX', ACCESS_TOKEN_EXPIRY_SECONDS);
            logger.info(`Logout: Access token blacklisted in Redis: ${accessToken}`);
        } catch (redisError) {
            logger.error("Logout: Redis error during access token blacklisting:", redisError);
        }

       
        return res.status(200).json({ message: "Logged out successfully." });

    } catch (error) {
       
        logger.error("Logout: Unhandled Internal Server Error:", error);
        return res.status(500).json({ message: "An internal server error occurred during logout." });
    }
};
module.exports.getUserInfo = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const data = await userModel.findById(user._id).select('-password -role -_id').lean();

        return res.status(200).json({
            data,
            message: 'Done'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error,
            message: 'failed'
        });
    }
}

module.exports.refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body; 
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required." });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFERSH_TOKEN);
        if (!decoded || !decoded._id) {
            return res.status(403).json({ message: "Invalid refresh token." });
        }

        const userId = decoded._id;
        const userIdString = userId.toString();
        const userRefreshTokensKey = `user:${userIdString}:refreshTokens`;
        const refreshTokenKeyInRedis = `refreshtoken:${refreshToken}`;

        const isTokenValid = await redis.sismember(userRefreshTokensKey, refreshToken);
        const userIdFromRedis = await redis.get(refreshTokenKeyInRedis);

        if (!isTokenValid || userIdFromRedis !== userIdString) {
            return res.status(401).json({ message: "Invalid or used refresh token." });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found for this refresh token." });
        }

        const newAccessToken = await user.accessToken();
        const newRefreshToken = await user.refershToken();

        // Update refresh token in Redis
        const pipeline = redis.pipeline();
        pipeline.del(refreshTokenKeyInRedis);
        pipeline.srem(userRefreshTokensKey, refreshToken);

        const newRefreshTokenKeyInRedis = `refreshtoken:${newRefreshToken}`;
        pipeline.set(newRefreshTokenKeyInRedis, userIdString, 'EX', REFRESH_TOKEN_EXPIRY_SECONDS);
        pipeline.sadd(userRefreshTokensKey, newRefreshToken);
        pipeline.expire(userRefreshTokensKey, REFRESH_TOKEN_EXPIRY_SECONDS + 300);
        await pipeline.exec();

        return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });

    } catch (error) {
        console.error("Refresh Token Error:", error);
        return res.status(403).json({ message: "Invalid refresh token." });
    }
};