// runOtpWorker.js (Create this new file)

require('dotenv').config(); // Load environment variables

const  consumeOtpQueue  = require('./src/worker/otpWorker'); // Adjust path
const connectDB = require('./src/utils/db'); // Worker needs DB connection too



// Connect to DB before starting consumer
connectDB()
    .then(() => {
        console.log("OTP Worker connected to DB.");

        // --- ADD THIS DEBUG LINE ---
        console.log("Type of consumeOtpQueue before calling:", typeof consumeOtpQueue);
        // --- ADD THIS DEBUG LINE ---

        // Line 11 (or around here depending on the added log): Call the function
        return consumeOtpQueue();
    })
    .catch(error => {
        console.error("OTP Worker failed to start (DB connection or Queue setup):", error);
        process.exit(1); // Exit if setup fails
    });

console.log("OTP Worker process started.");