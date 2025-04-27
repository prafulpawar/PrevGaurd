const amqp = require('amqplib');
const nodemailer = require('../services/nodeMailer');

async function consumeEmailQueue() {
    console.log('hello from consume')
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('emailQueue');
    channel.consume('emailQueue', async (msg) => {
        const { email, otp } = JSON.parse(msg.content.toString());
        try {
            await nodemailer.sendMail(email, 'Email Verification', otp);
            console.log(` Email sent to ${email}`);
            channel.ack(msg); 
        } catch (error) {
            console.error(` Email sending failed for ${email}:`, error);
        }
    });
}

consumeEmailQueue();

// worker/emailWorker.js (or wherever consumeEmailQueue lives)
// const amqp = require('amqplib');
// // Make sure nodemailer service is correctly imported
// const nodemailerService = require('../services/nodeMailer'); // Adjust path if needed
// const logger = require('../utils/logger'); // Use your logger

// async function consumeEmailQueue() {
//     try {
//         logger.info('[Email Worker] Attempting to connect to RabbitMQ...');
//         const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
//         const channel = await connection.createChannel();
//         const queueName = 'emailQueue';

//         await channel.assertQueue(queueName, { durable: true }); // Make queue durable
//         channel.prefetch(1); // Process one message at a time

//         logger.info(`[Email Worker] Waiting for messages in ${queueName}...`);

//         channel.consume(queueName, async (msg) => {
//             if (!msg) {
//                 logger.warn("[Email Worker] Received null message.");
//                 return;
//             }

//             const rawContent = msg.content.toString();
//             logger.info(`[Email Worker] Received message: ${rawContent}`);
//             let messageData;

//             try {
//                 messageData = JSON.parse(rawContent);
//                 const { email, otp } = messageData;

//                 if (!email || !otp) {
//                      logger.error("[Email Worker] Invalid message format received:", messageData);
//                      channel.ack(msg); // Acknowledge invalid message to remove it
//                      return;
//                 }

//                 logger.info(`[Email Worker] Attempting to send OTP to ${email}`);
//                 // Ensure sendMail is correctly called
//                 await nodemailerService.sendMail(email, 'Your Email Verification OTP', `Your OTP is: ${otp}`);
//                 logger.info(`[Email Worker] Successfully sent email to ${email}`);

//                 channel.ack(msg); // Acknowledge message ONLY after successful processing
//                 logger.info(`[Email Worker] Message acknowledged for ${email}`);

//             } catch (error) {
//                 logger.error(`[Email Worker] FAILED to process or send email for ${messageData?.email || 'unknown email'}:`, { error: error.message, stack: error.stack });
//                 // Decide how to handle failures:
//                 // Option 1: Nack and requeue (could cause infinite loops if error is persistent)
//                 // channel.nack(msg, false, true);
//                 // Option 2: Nack and discard (or send to dead-letter queue - preferred)
//                  channel.nack(msg, false, false); // Discard the message
//                 // Option 3: Ack anyway (as currently done implicitly, message is lost)
//                 // channel.ack(msg); // (Implicitly happening if error is in sendMail and ack is outside try)
//             }
//         }, {
//             noAck: false // Ensure manual acknowledgement is required
//         });

//     } catch (error) {
//         logger.error("[Email Worker] !!! FAILED to connect to RabbitMQ or setup consumer !!!:", error);
//         process.exit(1); // Exit if connection fails, process manager should restart it
//     }
// }

// consumeEmailQueue();