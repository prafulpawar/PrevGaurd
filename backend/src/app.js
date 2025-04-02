const dotenv = require('dotenv');
dotenv.config()
const express = require('express');
const connectDB = require('../src/utils/db');
connectDB()
const router = require('./routes/user.routes');


app.use('/user',router);

const app = express();
module.exports = app;