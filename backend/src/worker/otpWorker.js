const amqp = require('amqplib');
const redis = require('../utils/redis');
const userModel = require('../models/user.model');
const {sendOtpStatus} = require('../ws')
async function consumeOtpQueue() {
    
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('otpVerificationQueue');

    channel.consume('otpVerificationQueue', async (msg) => {
     
        const { email, otp ,requestId} = JSON.parse(msg.content.toString());

        try {
            const redisData = await redis.get(email);
            if (!redisData) {
                console.log(` OTP expired for ${email}`);
                return channel.ack(msg);
            }

            const { otp: storedOtp, username,  hashPassword } = JSON.parse(redisData);

            if (otp !== storedOtp) {
                console.log(` Invalid OTP for ${email}`);
                return channel.ack(msg);
            }

            
            await userModel.create({ username, password:  hashPassword, email });

            await redis.del(email);
            console.log(` User registered successfully: ${email}`);
            sendOtpStatus(requestId, "success");

            channel.ack(msg); 
        } catch (error) {
            console.error(` Error verifying OTP for ${email}:`, error);
        }
    });
}

consumeOtpQueue();
