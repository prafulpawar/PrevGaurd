const amqp = require('amqplib');

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://127.0.0.1');
        console.log("✅ Connected to RabbitMQ!");
        return connection;
    } catch (error) {
        console.error("❌ RabbitMQ Connection Error:", error);
    }
}

connectRabbitMQ();

module.exports = connectRabbitMQ;
