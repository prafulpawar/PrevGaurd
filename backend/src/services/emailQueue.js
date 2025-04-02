const amqp = require('amqplib');

let channel;

async function createChannel() {
    if (channel) return channel; // Return the existing channel if available

    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('emailQueue');

    console.log('✅ RabbitMQ Channel Created');
    return channel;
}

module.exports = createChannel;
