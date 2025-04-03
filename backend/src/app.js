const dotenv = require('dotenv');
dotenv.config()

const express = require('express');
const connectDB = require('../src/utils/db');
connectDB()
const router = require('./routes/user.routes');
const rebbitMQ = require('./services/rabbitMQ')
const appAPI = express();




appAPI.use(express.json());
appAPI.use(express.urlencoded({extended:true}));

// Default route
appAPI.get('/', (req, res) => {
    res.send('Server Is Running');
});



appAPI.use('/user',router);
//  Start email worker in background
require('./worker/emailWorker');
require('./worker/otpWorker')

module.exports = appAPI;


