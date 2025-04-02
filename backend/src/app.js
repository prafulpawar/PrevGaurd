const dotenv = require('dotenv');
dotenv.config()

const express = require('express');
const connectDB = require('../src/utils/db');
connectDB()
const router = require('./routes/user.routes');

const app = express();




app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Default route
app.get('/', (req, res) => {
    res.send('Server Is Running');
});

// Optional: Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        // Add cleanup for DB connection if needed
        process.exit(0);
    });
});


app.use('/user',router);
// //  Start email worker in background
// require('./worker/emailWorker');
// require('./worker/otpWorker')

module.exports = app;