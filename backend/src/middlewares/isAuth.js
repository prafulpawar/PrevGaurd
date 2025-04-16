const redis = require('../utils/redis');
const userModel = require('../models/user.model');

module.exports.verifyAuth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        console.log(authHeader)
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        
        // Check if token is blacklisted
        const blacklistedKey = `blacklisted:accessToken:${token}`;
        const isBlacklisted = await redis.exists(blacklistedKey);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token has been invalidated (logged out)." });
        }

        
        const decoded = await userModel.verifyAccessToken(token);

        req.user = decoded; 
       
        next();
    } catch (error) {
         console.log(err)
         console.error("Auth Middleware Error:", error.message);
         return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }
}

