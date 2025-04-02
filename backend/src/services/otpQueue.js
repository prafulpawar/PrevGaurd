const amqp = require('amqplib');

let channel; 
async function otpcreateChannel() {
    if (channel) return channel; // Return the existing channel if available

    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('otpVerificationQueue');

    console.log('✅ RabbitMQ Channel Created OTP');
    return channel;
}

module.exports = otpcreateChannel;


