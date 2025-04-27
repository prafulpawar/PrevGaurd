const amqp = require('amqplib');
const config = require('../config/config')
async function connectRabbitMQ() {
    try {
        const RABBITMQ_URL = config.RABBITMQ_URL || 'amqp://127.0.0.1';
        const connection = await amqp.connect(RABBITMQ_URL);

        console.log(" Connected to RabbitMQ!");
        return connection;
    } catch (error) {
        console.error(" RabbitMQ Connection Error:", error);
    }
}

connectRabbitMQ();

module.exports = connectRabbitMQ;
