const userModel = require("../models/user.model");
const otpGenerator = require('otp-generator')
const redis = require('../utils/redis');
const bcrypt = require('bcrypt')

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const isExists = await userModel.findOne({ $or: [{ email }, { username }] });
        if (isExists) {
            return res.status(409).json({ message: "User already exists" });
        }
              
        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
       
        // Store OTP in Redis
        const hashPassword = await bcrypt.hash(password)
        await redis.set(email, JSON.stringify({ otp, username,  hashPassword }), 'EX', 300);

        // ✅ Queue the email task instead of sending it directly
        const channel = await createChannel();
        channel.sendToQueue('emailQueue', Buffer.from(JSON.stringify({ email, otp })));

        return res.status(200).json({ 
            email,
            message: "OTP sent successfully"
         });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error in user registration", error: error.message });
    }
}

module.exports.verfifyOtp  = async(req,res)=>{
    try {
        const { email, otp } = req.body;
        if (!otp || !email) {
            return res.status(400).json({ message: "OTP and email are required" });
        }

        // ✅ Queue OTP verification task instead of direct checking
        const channel = await createChannel();
        channel.sendToQueue('otpVerificationQueue', Buffer.from(JSON.stringify({ email, otp })));

        return res.status(200).json({ message: "OTP verification in progress" });

    } catch (error) {
        return res.status(500).json({ message: "Error in OTP verification", error: error.message });
    }
    

}


