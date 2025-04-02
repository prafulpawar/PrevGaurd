const userModel = require("../models/user.model");
const otpGenerator = require('otp-generator');
const nodemailer = require('../services/nodeMailer');
const redis = require('../utils/redis');
const rateLimiter = require('../middlewares/rateLimiter');
const jwt = require('jsonwebtoken');
const Joi = require('joi'); // For input validation
const winston = require('winston'); // For logging

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

function generateOtp() {
    return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true });
}

// Apply Rate Limiting (Middleware)
module.exports.registerUser = [
    rateLimiter,  // Apply rate limiting to prevent abuse
    async (req, res) => {
        try {
            // Input validation using Joi
            const schema = Joi.object({
                username: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
            });

            const { error, value } = schema.validate(req.body);

            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { username, email, password } = value;

            const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return res.status(409).json({ message: "User already exists" });
            }

            // Generate OTP & store temporarily
            const otp = generateOtp();
            await redis.set(email, JSON.stringify({ otp, username, password }), 'EX', 300); // 5 minutes expiry

            // Send OTP securely (Do NOT expose it in response)
            await nodemailer.sendMail(email, 'Email Verification', otp);

            return res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            logger.error("Error in user registration:", error);
            return res.status(500).json({ message: "Error in user registration", error: error.message });
        }
    }
];

module.exports.verifyOtp = async (req, res) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            otp: Joi.string().length(6).required(),
        });

        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, otp } = value;
        const redisData = await redis.get(email);

        if (!redisData) {
            return res.status(401).json({ message: "OTP expired or not sent" });
        }

        const { otp: storedOtp, username, password } = JSON.parse(redisData);
        if (otp !== storedOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Hash the password before storing
        const hashedPassword = await userModel.hashPassword(password);

        // Create user securely
        const user = await userModel.create({ username, password: hashedPassword, email });

        // Clean up OTP from Redis
        await redis.del(email);

        // Generate Secure Tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Refresh Token Rotation
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        const rotatedRefreshToken = jwt.sign({ id: user._id, rotation: Date.now() }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Store refresh token securely
        await redis.set(`refreshToken:${user.email}`, rotatedRefreshToken, 'EX', 7 * 24 * 60 * 60);

        return res.status(200).json({ accessToken, refreshToken: rotatedRefreshToken, message: "User registered successfully" });
    } catch (error) {
        logger.error("Error in OTP verification:", error);
        return res.status(500).json({ message: "Error in OTP verification", error: error.message });
    }
};

