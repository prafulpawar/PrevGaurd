const amqp = require('amqplib');

let channel;

async function createChannel() {
    if (channel) return channel; 

    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('emailQueue');

    console.log('✅ RabbitMQ Channel Created');
    return channel;
}

module.exports = createChannel;

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
         } catch (error)
     {
             console.error(` Email sending failed for ${email}:`, error);
         }
     });
 }
 
 consumeEmailQueue();