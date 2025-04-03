const userModel = require("../models/user.model");
const otpGenerator = require('otp-generator')
const redis = require('../utils/redis');
const bcrypt = require('bcrypt')
const createChannel = require('../services/emailQueue');
const otpcreateChannel = require('../services/otpQueue');
const crypto = require("crypto");

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isExists = await userModel.findOne({ $or: [{ email }, { username }] });
        if (isExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        console.log(otp);

        const hashPassword = await bcrypt.hash(password, 10);
        await redis.set(email, JSON.stringify({ otp, username, hashPassword }), 'EX', 300);

        //  global channel
        const channel = await createChannel();
        channel.sendToQueue('emailQueue', Buffer.from(JSON.stringify({ email, otp })));

        return res.status(200).json({
            email,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in user registration", error: error.message });
    }
}

module.exports.verfifyOtp  = async(req,res,next)=>{
    try {
        const { email, otp } = req.body;
        if (!otp || !email) {
            return res.status(400).json({ message: "OTP and email are required" });
        }

        const requestId = crypto.randomUUID();

        
        const channel = await otpcreateChannel();
        channel.sendToQueue(
            "otpVerificationQueue",
            Buffer.from(JSON.stringify({ email, otp, requestId }))
        );

        return res.status(200).json({ message: "OTP verification in progress", requestId });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in OTP verification", error: error.message });
    }
}



module.exports.getOtpStatus = async (req, res) => {
    const { requestId } = req.query;

    if (!requestId) {
        return res.status(400).json({ message: "Request ID is required" });
    }

    const status = await redis.get(requestId);
    
    if (!status) {
        return res.status(404).json({ message: "No status found for this requestId" });
    }

    return res.status(200).json(JSON.parse(status));
};

