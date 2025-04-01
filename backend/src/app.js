const express = require('express');
const connectDB = require('../src/utils/db');
connectDB()
const app = express();
const dotenv = require('dotenv');
dotenv.config()
module.exports = app;