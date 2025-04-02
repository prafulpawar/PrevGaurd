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
            return res.status(409).json({
                messae: "User Is Alredy Exists"
            })
        }

        // generation of otp
        const otp = getOtp();
        
        await redis.set(email, JSON.stringify({otp, username ,password}),'EX',30)

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
        const {email,otp} = req.body;
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
              return res.status(400).json({
                  message:"Your OTP Is Invalid"
              })
        }

        // agar otp valid hai toh fir hum kya kar sakte hai?
        // user ko register kar sakte hai?
        const hashedPassword = await userModel.hashPassword(password);

        // now ab ek user ko register karna
        const user = await userModel.create({
              username,
              password:hashedPassword,
              email
        })
        await redis.del(email);

        const accessToken      = user.accessToken();
        const refreshToken     = user.refershToken();
        const expiresInSeconds = 7 * 24 * 60 * 60;

        await redis.set(`refershToken ${user.email}`, refreshToken, 'EX', expiresInSeconds); 
         // redis.set('key', 'value', 'mode', 'time')

        return res.status(200).json({
            accessToken,
            message:"User Is Registered"
        })


}


