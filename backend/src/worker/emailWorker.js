// const amqp = require('amqplib');
// const nodemailer = require('../services/nodeMailer');

// async function consumeEmailQueue() {
//     console.log('hello from consume')
//     const connection = await amqp.connect('amqp://localhost');
//     const channel = await connection.createChannel();
//     await channel.assertQueue('emailQueue');

//     channel.consume('emailQueue', async (msg) => {
//         const { email, otp } = JSON.parse(msg.content.toString());

//         try {
//             await nodemailer.sendMail(email, 'Email Verification', otp);
//             console.log(` Email sent to ${email}`);
//             channel.ack(msg); // Acknowledge message after processing
//         } catch (error) {
//             console.error(` Email sending failed for ${email}:`, error);
//         }
//     });
// }

// consumeEmailQueue();

// worker/emailWorker.js
const amqp = require('amqplib');
const nodemailer = require('../services/nodeMailer'); // Adjust path if needed
const { configData } = require('../config/config'); // Adjust path for RabbitMQ URL if moved there

// Define the consumer function but don't call it here
async function consumeEmailQueue() {
    console.log('Attempting to start Email Worker...');
    // TODO: Get RabbitMQ URL from config/env
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queueName = 'emailQueue';
    await channel.assertQueue(queueName);

    console.log(`[*] Email Worker waiting for messages in ${queueName}. To exit press CTRL+C`);

    channel.consume(queueName, async (msg) => {
        if (msg !== null) {
            console.log(`[x] Received message from ${queueName}`);
            const { email, otp } = JSON.parse(msg.content.toString());

            try {
                await nodemailer.sendMail(email, 'Email Verification', `Your OTP is: ${otp}`);
                console.log(` Email sent successfully to ${email}`);
                channel.ack(msg); // Acknowledge message only after successful processing
            } catch (error) {
                console.error(` Email sending failed for ${email}:`, error);
                // Decide how to handle failure:
                // Option 1: Nack and requeue (careful with infinite loops - add retry limit)
                // channel.nack(msg, false, true);
                // Option 2: Nack and discard (or send to Dead Letter Queue)
                channel.nack(msg, false, false);
                // Log the failure more robustly here
            }
        }
    }, {
        // Manual acknowledgment mode.
        noAck: false // IMPORTANT: Set noAck to false for manual ack/nack
    });
}

// Export the function
module.exports = { consumeEmailQueue };