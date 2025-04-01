const dotenv = require('dotenv');
dotenv.config()

const express = require('express');
const connectDB = require('../src/utils/db');
connectDB()
const app = express();
module.exports = app;