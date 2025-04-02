const dotenv = require('dotenv');
dotenv.config()
const express = require('express');
const connectDB = require('../src/utils/db');
connectDB()
const router = require('./routes/user.routes');

const app = express();
app.use('/user',router);
module.exports = app;