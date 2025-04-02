const amqp = require('amqplib');
const nodemailer = require('../services/nodeMailer');

async function consumeEmailQueue() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('emailQueue');

    channel.consume('emailQueue', async (msg) => {
        const { email, otp } = JSON.parse(msg.content.toString());

        try {
            await nodemailer.sendMail(email, 'Email Verification', otp);
            console.log(`✅ Email sent to ${email}`);
            channel.ack(msg); // Acknowledge message after processing
        } catch (error) {
            console.error(`❌ Email sending failed for ${email}:`, error);
        }
    });
}

consumeEmailQueue();
