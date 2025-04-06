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
    origin: 'http://localhost:5173', // केवल अपने फ्रंटएंड डोमेन को अनुमति दें
    credentials: true,
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


