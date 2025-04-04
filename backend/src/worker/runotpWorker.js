// worker/otpWorker.js
const amqp = require('amqplib');
const connectDB = require('../utils/db');
connectDB()
const redis = require('../utils/redis'); 
const userModel = require('../models/user.model');
const logger = require('../utils/logger'); 


async function consumeOtpQueue() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'otpVerificationQueue';

        await channel.assertQueue(queueName, { durable: true }); 
      
        channel.prefetch(parseInt(process.env.OTP_WORKER_PREFETCH || '5', 10));

        logger.info(`[OTP Worker] Waiting for messages in ${queueName}...`);

        channel.consume(queueName, async (msg) => {
            if (!msg) {
                logger.warn("[OTP Worker] Received null message.");
                return;
            }

            let messageData;
            const rawContent = msg.content.toString();
            logger.info(`[OTP Worker] Received message: ${rawContent}`);

            try {
                messageData = JSON.parse(rawContent);
                const { email, otp, requestId } = messageData;

                if (!email || !otp || !requestId) {
                     logger.error("[OTP Worker] Invalid message format received:", messageData);
                     return channel.ack(msg);
                }

                logger.info(`[OTP Worker] Processing OTP for Email: ${email}, RequestID: ${requestId}`);

             
                const redisData = await redis.get(`otp:${email}`); // Prefix के साथ key यूज़ करें
                if (!redisData) {
                    logger.warn(`[OTP Worker] OTP data expired or not found in Redis for ${email} (RequestID: ${requestId})`);
                 
                    await redis.set(`status:${requestId}`, JSON.stringify({ status: "expired", message: "OTP has expired or is invalid." }), "EX", 300); // 5 मिनट TTL
                    return channel.ack(msg);
                }

                const { otp: storedOtp, username, hashPassword } = JSON.parse(redisData);
                logger.debug(`[OTP Worker] Comparing OTPs for ${email}. Received: ${otp}, Stored: ${storedOtp}`);

               
                if (otp !== storedOtp) {
                    logger.warn(`[OTP Worker] Invalid OTP provided for ${email} (RequestID: ${requestId})`);
                  
                    await redis.set(`status:${requestId}`, JSON.stringify({ status: "invalid", message: "The OTP provided is incorrect." }), "EX", 300);
                    return channel.ack(msg); 
                }

              
                logger.info(`[OTP Worker] OTP verified for ${email}. Creating user... (RequestID: ${requestId})`);
                try {
                     console.log(userModel)
                      
                     const existingUser = await userModel.findOne({ $or: [{ email }, { username }] }).lean();
                     if (existingUser) {
                         logger.warn(`[OTP Worker] User ${email} or ${username} already exists during OTP verification final step (RequestID: ${requestId})`);
                       
                         await redis.set(`status:${requestId}`, JSON.stringify({ status: "conflict", message: "User already registered." }), "EX", 300);
                     } else {
                         await userModel.create({ username, password: hashPassword, email });
                         logger.info(`[OTP Worker] User registered successfully for ${email}. (RequestID: ${requestId})`);
                       
                         await redis.set(`status:${requestId}`, JSON.stringify({ status: "success", message: "User registered successfully!" }), "EX", 300);
                     }

                } catch (dbError) {
                    console.log(dbError,'ye error hai')
                     logger.error(`[OTP Worker] Error creating user ${email} in DB:`, { error: dbError.message, stack: dbError.stack, requestId });
                    
                     await redis.set(`status:${requestId}`, JSON.stringify({ status: "error", message: "Failed to register user due to a database error." }), "EX", 300);
                     // DB एरर गंभीर हो सकता है, शायद मैसेज को requeue न करें? अभी ack करते हैं।
                     return channel.ack(msg);
                }


           
                logger.info(`[OTP Worker] Deleting OTP data from Redis for ${email}`);
                await redis.del(`otp:${email}`);

               
                channel.ack(msg);
                logger.info(`[OTP Worker] Message acknowledged for ${email} (RequestID: ${requestId})`);

            } catch (error) {
                logger.error(`[OTP Worker] !!! UNEXPECTED ERROR processing message for ${messageData?.email || 'unknown email'} (RequestID: ${messageData?.requestId}) !!!:`, { error: error.message, stack: error.stack });
             
                 if (messageData?.requestId) {
                     try {
                        await redis.set(`status:${messageData.requestId}`, JSON.stringify({ status: "error", message: "An unexpected internal server error occurred." }), "EX", 300);
                     } catch (redisErr) {
                         logger.error("[OTP Worker] Failed to write error status to Redis after unexpected error:", redisErr);
                     }
                 }
              
                channel.ack(msg);
            }
        }, {
            noAck: false 
        });

    } catch (error) {
        logger.error("[OTP Worker] !!! FAILED to connect to RabbitMQ or setup consumer !!!:", error);
        process.exit(1); 
    }
}

consumeOtpQueue(); 