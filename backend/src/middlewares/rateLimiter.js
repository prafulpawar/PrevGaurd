const redis = require('../utils/redis');

const RATE_LIMIT = 5; // Max requests per user
const WINDOW_SIZE_IN_SECONDS = 60; // Time window

const rateLimiter = async (req, res, next) => {
    try {
        // Get client IP, handling proxies
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        const key = `rateLimit:${ip}`;

        // Increment request count and set expiry if new
        const currentRequests = await redis.incr(key);

        if (currentRequests === 1) {
            await redis.expire(key, WINDOW_SIZE_IN_SECONDS); // Set TTL only for the first request
        }

        if (currentRequests > RATE_LIMIT) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }

        next();
    } catch (error) {
        logger.error("Rate limiter error:", error);
        return res.status(500).json({ message: "Server error in rate limiter", error: error.message });
    }
};

module.exports = rateLimiter;