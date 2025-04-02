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
