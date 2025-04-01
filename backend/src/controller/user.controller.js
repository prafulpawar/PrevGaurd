// const userModel = require("../models/user.model");
// const otpGenerator = require('otp-generator')
// const nodemailer = require('../services/nodeMailer');
// const redis = require('../utils/redis');

// function getOtp (){
//     const data = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
//     return data
// }

// module.exports.registerUser = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         if (!username || !email || !password) {
//             return res.status(401).json({
//                 message: "All Fields Must Be Required"
//             })
//         }
//         // find if user exists 
//         const isExists = await userModel.findOne({
//             $or: [
//                 { email },
//                 { username }
//             ]
//         })

//         // if exists
//         if (isExists) {
//             return res.status(409).json({
//                 messae: "User Is Alredy Exists"
//             })
//         }

//         // generation of otp
//         const otp = getOtp();
        
//         await redis.set(email, JSON.stringify({otp, username ,password}),'EX',30)

//         // Now Send OTP 
//         await nodemailer.sendMail(email,'EmailVerification',otp);
//         // hashpassword

//         return res.status(200).json({
//             email,
//             otp,
//             message:"OTP Send SuccessFully"
//         })
//     }
//     catch (error) {
//         return res.status(401).json({
//             message: "Error In Creation "
//         })
//     }
// }

// module.exports.verfifyOtp  = async(req,res)=>{
//         const {email,otp} = req.body;
//         if(!otp){
//             return res.status(401).json({
//                 message: "Error In GGetting Otp"
//             })
//         }
//         const redisData = await redis.get(email);
//         if (!redisData) {
//             return res.status(401).json({ message: "OTP has expired or not sent" });
//         }

//         const { otp: storedOtp, username, password } = JSON.parse(redisData);

//         if(otp !== storedOtp){
//               return res.status(400).json({
//                   message:"Your OTP Is Invalid"
//               })
//         }

//         // agar otp valid hai toh fir hum kya kar sakte hai?
//         // user ko register kar sakte hai?
//         const hashedPassword = await userModel.hashPassword(password);

//         // now ab ek user ko register karna
//         const user = await userModel.create({
//               username,
//               password:hashedPassword,
//               email
//         })
//         await redis.del(email);

//         const accessToken      = user.accessToken();
//         const refreshToken     = user.refershToken();
//         const expiresInSeconds = 7 * 24 * 60 * 60;

//         await redis.set(`refershToken ${user.email}`, refreshToken, 'EX', expiresInSeconds); 
//          // redis.set('key', 'value', 'mode', 'time')

//         return res.status(200).json({
//             accessToken,
//             message:"User Is Registered"
//         })


// }


// // controllers/auth.controller.js (Example file name)
// vs this 
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto'); // Node.js built-in module for hashing
// const userModel = require("../models/user.model"); // Assuming your model is here
// const otpGenerator = require('otp-generator');
// const nodemailer = require('../services/nodeMailer'); // Your nodemailer setup
// const redis = require('../utils/redis'); // Your Redis client setup

// // --- Configuration (BEST PRACTICE: Use Environment Variables) ---
// const JWT_OTP_SECRET = process.env.JWT_OTP_SECRET || 'your-very-strong-otp-secret-key'; // REPLACE with env variable
// const JWT_OTP_EXPIRES_IN = '5m'; // OTP Token validity (e.g., 5 minutes)
// const REFRESH_TOKEN_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60; // 7 days

// // --- Helper Functions ---
// function getOtp() {
//     // Generates a 6-digit numeric OTP
//     return otpGenerator.generate(6, {
//         upperCaseAlphabets: false,
//         specialChars: false,
//         lowerCaseAlphabets: false,
//         digits: true
//     });
// }

// // Helper to hash OTP (using SHA256)
// function hashOtp(otp) {
//     // Adding a simple salt from env or config is also a good practice
//     return crypto.createHash('sha256').update(otp).digest('hex');
// }
// //---------------------------------


// module.exports.registerUser = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

     
//         if (!username || !email || !password) {
//             return res.status(400).json({
//                 message: "All Fields Must Be Required"
//             });
//         }

//         // 2. Check if user exists
//         const isExists = await userModel.findOne({
//             $or: [{ email }, { username }]
//         });

//         if (isExists) {
//             return res.status(409).json({ 
//                 message: "User with this email or username already exists"
//             });
//         }

      
//         const hashedPassword = await userModel.hashPassword(password);
//         if (!hashedPassword) {
             
//              console.error("Password hashing failed for:", email);
//              return res.status(500).json({ message: "Failed to process registration." });
//         }

      
//         const otp = getOtp();
//         const hashedOtp = hashOtp(otp);

      
//         const otpTokenPayload = {
//             email,
//             username,
//             hp: hashedPassword, 
//             oh: hashedOtp,     
//         };

       
//         const signedOtpToken = jwt.sign(
//             otpTokenPayload,
//             JWT_OTP_SECRET,
//             { expiresIn: JWT_OTP_EXPIRES_IN }
//         );

       
//         try {
//             await nodemailer.sendMail(email, 'Email Verification OTP', `Your OTP is: ${otp}`); // Send the plain OTP
//         } catch (mailError) {
//             console.error("Failed to send OTP email:", mailError);
         
//             return res.status(500).json({ message: "Could not send OTP email." });
//         }

        
//         return res.status(200).json({
//             message: "OTP Sent Successfully to your email. Please verify.",
           
//             otpToken: signedOtpToken 
//         });

//     } catch (error) {
//         console.error("Error in registerUser:", error);
//         return res.status(500).json({ 
//             message: "An error occurred during registration."
//         });
//     }
// };


// module.exports.verifyOtp = async (req, res) => {
//     try {
//         const { otp, otpToken } = req.body; 

//         // 1. Validation
//         if (!otp || !otpToken) {
//             return res.status(400).json({
//                 message: "OTP and OTP Token are required."
//             });
//         }

//         let decodedPayload;
//         try {
           
//             decodedPayload = jwt.verify(otpToken, JWT_OTP_SECRET);
//         } catch (jwtError) {
//             console.error("JWT Verification Error:", jwtError.message);
//             if (jwtError.name === 'TokenExpiredError') {
//                 return res.status(410).json({ message: "OTP has expired. Please register again." }); // 410 Gone
//             }
//             if (jwtError.name === 'JsonWebTokenError') {
//                 return res.status(401).json({ message: "Invalid OTP token." });
//             }
           
//              return res.status(400).json({ message: "Invalid OTP token." });
//         }

     
//         const { email, username, hp: hashedPasswordFromToken, oh: hashedOtpFromToken } = decodedPayload;

       
//         const hashedInputOtp = hashOtp(otp);

      
//         if (hashedInputOtp !== hashedOtpFromToken) {
//             return res.status(400).json({
//                 message: "Invalid OTP entered."
//             });
//         }

//         const user = await userModel.create({
//             username,
//             email,
//             password: hashedPasswordFromToken 
//         });

      
//         if (!user) {
//             console.error("User creation failed after OTP verification for:", email);
           
//             return res.status(500).json({ message: "Failed to create user account." });
//         }

//         const accessToken = user.accessToken(); 
//         const refreshToken = user.refreshToken(); 

//         const redisKey = `refreshToken:${user._id}`; 
//         await redis.set(redisKey, refreshToken, 'EX', REFRESH_TOKEN_EXPIRES_IN_SECONDS);

       
//         return res.status(201).json({ 
//             message: "User registered successfully!",
//             accessToken,
//             refreshToken 
//         });

//     } catch (error) {
//         console.error("Error in verifyOtp:", error);
        
//          if (error.code === 11000) {
//              return res.status(409).json({ message: "User already exists (conflict during creation)." });
//          }
//         return res.status(500).json({
//             message: "An error occurred during OTP verification."
//         });
//     }
// };

// 3rd way 

// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const userModel = require("../models/user.model"); // Assuming your model is here
const otpService = require('../services/otpService'); // Import the (mock) OTP service
const redis = require('../utils/redis'); // Your Redis client setup

// --- Configuration (BEST PRACTICE: Use Environment Variables) ---
// Yeh secret ab temporary user data ko carry karne wale JWT ke liye hai
const JWT_TEMP_SECRET = process.env.JWT_TEMP_SECRET || 'your-temporary-data-secret-key'; // REPLACE with env variable
const JWT_TEMP_EXPIRES_IN = '10m'; // Temporary Token validity (should be slightly longer than OTP validity)
const REFRESH_TOKEN_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60; // 7 days

// --- Helper Functions (Password hashing userModel mein maan rahe hain) ---

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All Fields Must Be Required" });
        }

        // 2. Check if user exists
        const isExists = await userModel.findOne({ $or: [{ email }, { username }] });
        if (isExists) {
            return res.status(409).json({ message: "User with this email or username already exists" });
        }

        // 3. Hash Password EARLY
        const hashedPassword = await userModel.hashPassword(password);
        if (!hashedPassword) {
             console.error("Password hashing failed for:", email);
             return res.status(500).json({ message: "Failed to process registration." });
        }

        // 4. Request OTP sending via external service
        try {
            const otpSent = await otpService.sendOtp(email); // Use email or phone based on your setup
            if (!otpSent) {
                 console.error("OTP Service failed to initiate sending for:", email);
                 return res.status(500).json({ message: "Could not initiate OTP sending process." });
            }
        } catch (serviceError) {
            console.error("Error calling OTP service for sending:", serviceError);
            return res.status(502).json({ message: "OTP service unavailable or encountered an error." }); // 502 Bad Gateway might be appropriate
        }

        // 5. Create a temporary JWT to hold data until verification
        // Payload mein ab OTP nahi hai, sirf user details
        const tempTokenPayload = {
            email,
            username,
            hp: hashedPassword, // Hashed password
        };

        const temporaryToken = jwt.sign(
            tempTokenPayload,
            JWT_TEMP_SECRET,
            { expiresIn: JWT_TEMP_EXPIRES_IN }
        );

        // 6. Send Response to Client
        // Client ko sirf token dena hai, OTP email/sms se jayega
        return res.status(200).json({
            message: "OTP Sent Successfully to your email/phone. Please verify.",
            tempToken: temporaryToken // Client ko yeh token save karke verify request ke saath bhejna hoga
        });

    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ message: "An error occurred during registration." });
    }
};


module.exports.verifyOtp = async (req, res) => {
    try {
        const { otp, tempToken } = req.body; // Client ko OTP aur temporary token bhejna hoga

        // 1. Validation
        if (!otp || !tempToken) {
            return res.status(400).json({ message: "OTP and temporary token are required." });
        }

        // 2. Verify and Decode the temporary JWT
        let decodedPayload;
        try {
            decodedPayload = jwt.verify(tempToken, JWT_TEMP_SECRET);
        } catch (jwtError) {
            console.error("Temporary JWT Verification Error:", jwtError.message);
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(410).json({ message: "Verification window expired. Please register again." }); // 410 Gone
            }
            return res.status(401).json({ message: "Invalid or corrupt temporary token." }); // 401 Unauthorized
        }

        // Extract user details from the valid temporary token
        const { email, username, hp: hashedPasswordFromToken } = decodedPayload;

        // 3. Verify OTP using the external service
        let isOtpValid = false;
        try {
            isOtpValid = await otpService.verifyOtp(email, otp); // Use email or phone
        } catch (serviceError) {
            console.error("Error calling OTP service for verification:", serviceError);
            return res.status(502).json({ message: "OTP service unavailable or encountered an error during verification." });
        }

        // 4. Check OTP Verification Result
        if (!isOtpValid) {
            return res.status(400).json({ message: "Invalid or expired OTP entered." });
        }

        // 5. Create User in Database (OTP is valid)
        let user;
        try {
             user = await userModel.create({
                username,
                email,
                password: hashedPasswordFromToken // Use the hashed password from the token
             });
        } catch (dbError) {
             console.error("User creation failed after OTP verification for:", email, dbError);
             // Handle potential duplicate key error if user somehow got created between checks
             if (dbError.code === 11000) {
                 return res.status(409).json({ message: "User already exists (conflict during final creation)." });
             }
             return res.status(500).json({ message: "Failed to create user account after verification." });
        }


        // 6. Generate Access and Refresh Tokens
        const accessToken = user.accessToken(); // Assuming these methods exist on your user model
        const refreshToken = user.refreshToken();

        // 7. Store Refresh Token in Redis
        const redisKey = `refreshToken:${user._id}`; // Use user ID for uniqueness
        try{
             await redis.set(redisKey, refreshToken, 'EX', REFRESH_TOKEN_EXPIRES_IN_SECONDS);
        } catch(redisError){
             console.error(`Failed to store refresh token in Redis for user ${user._id}:`, redisError);
             // Decide how critical this is. Maybe log and continue, or return an error?
             // For now, let's proceed but log the error.
        }


        // 8. Send Final Success Response
        return res.status(201).json({ // 201 Created is appropriate here
            message: "User registered successfully!",
            accessToken,
            refreshToken // Send refresh token to client to store securely (e.g., httpOnly cookie)
        });

    } catch (error) {
        console.error("Error in verifyOtp:", error);
        return res.status(500).json({ message: "An error occurred during OTP verification process." });
    }
};