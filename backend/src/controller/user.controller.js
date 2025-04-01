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
        const otpSaved = await redis.set(email, otp, 'EX', 300)
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
        // 
        const getOtp = await redis.get(email,otp);
        
        
}