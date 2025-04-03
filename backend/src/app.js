const dotenv = require('dotenv');
dotenv.config()

const express = require('express');
const connectDB = require('../src/utils/db');
connectDB()
const router = require('./routes/user.routes');

const appAPI = express();




appAPI.use(express.json());
appAPI.use(express.urlencoded({extended:true}));

// Default route
appAPI.get('/', (req, res) => {
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


appAPI.use('/user',router);
// //  Start email worker in background
// require('./worker/emailWorker');
// require('./worker/otpWorker')

module.exports = appAPI;


