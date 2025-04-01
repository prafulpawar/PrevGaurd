const userModel = require("../models/user.model");
const otpGenerator = require('otp-generator')
const nodemailer = require('../services/nodeMailer');
const redis = require('../utils/redis');

function getOtp (){
    const data = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    return data
}

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "All Fields Must Be Required"
            })
        }
        // find if user exists 
        const isExists = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        })

        // if exists
        if (isExists) {
            return res.status(401).json({
                messae: "User Is Alredy Exists"
            })
        }

        // generation of otp
        const otp = getOtp();
        
        await redis.set(email, JSON.stringify({otp, username ,password}),'EX',300)

        // Now Send OTP 
        await nodemailer.sendMail(email,'EmailVerification',otp);
        // hashpassword

        return res.status(200).json({
            email,
            otp,
            message:"OTP Send SuccessFully"
        })
    }
    catch (error) {
        return res.status(401).json({
            message: "Error In Creation "
        })
    }
}

module.exports.verfifyOtp  = async(req,res)=>{
        const {otp} = req.body;
        if(!otp){
            return res.status(401).json({
                message: "Error In GGetting Otp"
            })
        }
        const redisData = await redis.get(email);
        if (!redisData) {
            return res.status(401).json({ message: "OTP has expired or not sent" });
        }

        const { otp: storedOtp, username, password } = JSON.parse(redisData);

        if(otp !== storedOtp){
              return res.status(200).json({
                  message:"Your OTP Is Invalid"
              })
        }

        // agar otp valid hai toh fir hum kya kar sakte hai?
        // user ko register kar sakte hai?
        


}