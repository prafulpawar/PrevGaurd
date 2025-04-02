const amqp = require('amqplib/callback_api');
amqp.connect('amqp://127.0.0.1', function (err, conn) {
    if (err) {
        console.error("Connection Error:", err);
    } else {
        console.log("Connected to RabbitMQ!");
    }
});

