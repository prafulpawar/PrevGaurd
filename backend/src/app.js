const dotenv = require('dotenv');
dotenv.config()

const express = require('express');
const connectDB = require('../src/utils/db');
connectDB()
const router = require('./routes/user.routes');
const rebbitMQ = require('./services/rabbitMQ')
const appAPI = express();
const cors = require('cors')

// appAPI.set('trust proxy', true);

appAPI.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], // Add needed headers.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Add needed methods.
}));
appAPI.use(express.json());
appAPI.use(express.urlencoded({extended:true}));

appAPI.use((req, res, next) => {
    console.log('Client IP:', req.ip);
    console.log('Forwarded IPs:', req.ips);
    next();
});


// Default route
appAPI.get('/', (req, res) => {
    res.send('Server Is Running');
});



appAPI.use('/api',router);


module.exports = appAPI;


