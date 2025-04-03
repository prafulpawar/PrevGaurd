const userModel = require("../models/user.model");
const otpGenerator = require('otp-generator')
const redis = require('../utils/redis');
const bcrypt = require('bcrypt')
const createChannel = require('../services/emailQueue');
const otpcreateChannel = require('../services/otpQueue');
const crypto = require("crypto");

const logger = require('../utils/logger'); // मानें कि आपके पास लॉगर है

module.exports.registerUser = async (req, res) => {
    try {
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

        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        logger.info(`Generated OTP ${otp} for ${email}`);

        const hashPassword = await bcrypt.hash(password, 10);

        // TTL
        const otpData = JSON.stringify({ otp, username, hashPassword });
        await redis.set(`otp:${email}`, otpData, 'EX', 300);


        const channel = await createChannel();
        if (channel) {
            channel.sendToQueue('emailQueue', Buffer.from(JSON.stringify({ email, otp })));
            logger.info(`Email task queued for ${email}`);
        } else {
            logger.error("Failed to get RabbitMQ channel for emailQueue");

        }


        return res.status(200).json({
            email,
            message: "OTP sent successfully. Please verify."
        });

    } catch (error) {
        console.log(error)
        logger.error("Error in user registration:", { error: error.message, stack: error.stack });
        return res.status(500).json({ message: "Error during user registration" });
    }
};

module.exports.verfifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!otp || !email) {
            logger.warn("OTP verification attempt with missing fields", { body: req.body });
            return res.status(400).json({ message: "OTP and email are required" });
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
            message: "OTP verification request received. Check status using the requestId.",
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

        const statusData = await redis.get(`status:${requestId}`); // Key में prefix जोड़ें

        if (!statusData) {

            logger.debug(`No status found yet for RequestID: ${requestId}`);
            return res.status(202).json({ // 202 Accepted या 404 Not Found भी इस्तेमाल कर सकते हैं
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
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({
            message: "Invlid Credentils "
        })
    }
    // cheking ki user hai
    const isExists = await userModel.findOne({ email });
    if (!isExists) {
        return res.status(401).json({
            message: "No User Exists "
        })
    }
    // comparing password
    
    const isMatch = await isExists.comparePassword(password,isExists.password);

    if(!isMatch){
        return res.status(401).json({
            message: "Invalid Creadintials"
        })
    }

    // now next move generation of accessToken and refershToken
    const accesstoken  = await userModel.accesstoken();
    const refershtoken = await userModel.refershToken();

    // sending response 

    




}