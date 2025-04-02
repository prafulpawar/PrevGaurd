const amqp = require('amqplib');

async function createChannel() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('otpVerificationQueue');
    return channel;
}

module.exports = createChannel;
