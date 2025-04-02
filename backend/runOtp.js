// runOtpWorker.js (Create this new file)

require('dotenv').config(); // Load environment variables

const { consumeOtpQueue } = require('./worker/otpWorker'); // Adjust path
const connectDB = require('../src/utils/db'); // Worker needs DB connection too

// Connect to DB before starting consumer
connectDB().then(() => {
    console.log("OTP Worker connected to DB.");
    return consumeOtpQueue(); // Start consumer after DB connection
}).catch(error => {
    console.error("OTP Worker failed to start:", error);
    process.exit(1); // Exit if setup fails
});

console.log("OTP Worker process started.");