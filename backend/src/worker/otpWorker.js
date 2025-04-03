// const amqp = require('amqplib');
// const redis = require('../utils/redis');
// const userModel = require('../models/user.model');
// const {sendOtpStatus} = require('../ws')
// async function consumeOtpQueue() {
    
//     const connection = await amqp.connect('amqp://localhost');
//     const channel = await connection.createChannel();
//     await channel.assertQueue('otpVerificationQueue');

//     channel.consume('otpVerificationQueue', async (msg) => {
     
//         const { email, otp ,requestId} = JSON.parse(msg.content.toString());

//         try {
//             const redisData = await redis.get(email);
//             if (!redisData) {
//                 console.log(` OTP expired for ${email}`);
//                 return channel.ack(msg);
//             }

//             const { otp: storedOtp, username,  hashPassword } = JSON.parse(redisData);

//             if (otp !== storedOtp) {
//                 console.log(` Invalid OTP for ${email}`);
//                 return channel.ack(msg);
//             }

            
//             await userModel.create({ username, password:  hashPassword, email });

//             await redis.del(email);
//             console.log(` User registered successfully: ${email}`);
//             sendOtpStatus(requestId, "success");

//             channel.ack(msg); 
//         } catch (error) {
//             console.error(` Error verifying OTP for ${email}:`, error);
//         }
//     });
// }

// consumeOtpQueue();


// worker/otpWorker.js
const amqp = require('amqplib');
const redis = require('../utils/redis'); // Adjust path
const userModel = require('../models/user.model'); // Adjust path
const { sendOtpStatus } = require('../ws'); // Adjust path
const { configData } = require('../config/config'); // Adjust path for RabbitMQ URL if moved there


async function consumeOtpQueue() {
    console.log('Attempting to start OTP Verification Worker...');
    // TODO: Get RabbitMQ URL from config/env
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queueName = 'otpVerificationQueue';
    await channel.assertQueue(queueName);

    console.log(`[*] OTP Worker waiting for messages in ${queueName}. To exit press CTRL+C`);

    channel.consume(queueName, async (msg) => {
        if (msg !== null) {
            console.log(`[x] Received message from ${queueName}`);
            let messageData;
            try {
                messageData = JSON.parse(msg.content.toString());
                const { email, otp, requestId } = messageData;

                const redisData = await redis.get(email);
                if (!redisData) {
                    console.log(` OTP data expired or not found in Redis for ${email} (Request ID: ${requestId})`);
                    sendOtpStatus(requestId, "failure_expired"); // Send specific status
                    channel.ack(msg); // Acknowledge: nothing more to do
                    return;
                }

                const { otp: storedOtp, username, hashPassword } = JSON.parse(redisData);

                if (otp !== storedOtp) {
                    console.log(` Invalid OTP for ${email} (Request ID: ${requestId})`);
                    sendOtpStatus(requestId, "failure_invalid_otp"); // Send specific status
                    channel.ack(msg); // Acknowledge: incorrect OTP, processing finished
                    return;
                }

                // --- OTP is valid ---
                try {
                    // Create user *before* deleting Redis key
                    await userModel.create({ username, password: hashPassword, email });
                    console.log(` User registered successfully: ${email} (Request ID: ${requestId})`);

                    // Delete Redis key only after successful user creation
                    await redis.del(email);
                    console.log(` Redis key deleted for ${email}`);

                    sendOtpStatus(requestId, "success");
                    channel.ack(msg); // Acknowledge: successful processing

                } catch (dbError) {
                    console.error(` Error saving user to DB for ${email} (Request ID: ${requestId}):`, dbError);
                    // DB error - don't delete Redis key yet. Decide how to handle.
                    sendOtpStatus(requestId, "failure_server_error");
                    // Nack and requeue might be appropriate here for transient DB errors,
                    // but needs retry logic/limit. For now, Nack and discard.
                    channel.nack(msg, false, false);
                }

            } catch (parseError) {
                console.error(" Error parsing message content:", parseError, msg.content.toString());
                // Message is malformed, discard it
                channel.nack(msg, false, false);
            }
        }
    }, {
        noAck: false // Use manual acknowledgments
    });
}

module.exports =  consumeOtpQueue ;