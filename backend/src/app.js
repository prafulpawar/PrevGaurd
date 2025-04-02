const dotenv = require('dotenv');
dotenv.config()

const express = require('express');
const connectDB = require('../src/utils/db');
connectDB()
const router = require('./routes/user.routes');

const app = express();
const rabbitMQ = require('./services/rabbitMQ')




app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Default route
app.get('/', (req, res) => {
    res.send('Server Is Running');
});

app.use('/user',router);




module.exports = app;