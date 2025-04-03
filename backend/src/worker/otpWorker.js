// worker/otpWorker.js
const amqp = require('amqplib');
const redis = require('../utils/redis'); // Ensure correct path
const userModel = require('../models/user.model'); // Ensure correct path
const { sendOtpStatus } = require('../ws'); // Ensure correct path and function exists

channel.consume("otpVerificationQueue", async (msg) => {
    console.log("📩 Received OTP Verification Task:", msg.content.toString());
    const { email, otp, requestId } = JSON.parse(msg.content.toString());

    try {
        const redisData = await redis.get(email);
        if (!redisData) {
            console.log(`❌ OTP expired for ${email}`);
            await redis.set(requestId, JSON.stringify({ status: "expired" }), "EX", 60); // Store for 60s
            return channel.ack(msg);
        }

        const { otp: storedOtp, username, hashPassword } = JSON.parse(redisData);

        if (otp !== storedOtp) {
            console.log(`❌ Invalid OTP for ${email}`);
            await redis.set(requestId, JSON.stringify({ status: "invalid" }), "EX", 60);
            return channel.ack(msg);
        }

        await userModel.create({ username, password: hashPassword, email });

        await redis.del(email);
        console.log(`✅ User registered successfully: ${email}`);

        await redis.set(requestId, JSON.stringify({ status: "success" }), "EX", 60);

        channel.ack(msg);
    } catch (error) {
        console.error(`❌ Error verifying OTP for ${email}:`, error);
        await redis.set(requestId, JSON.stringify({ status: "error" }), "EX", 60);
    }
});
