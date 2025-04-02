// runEmailWorker.js (Create this new file)

// Load environment variables if needed, especially if config relies on them
require('dotenv').config();

const { consumeEmailQueue } = require('./worker/emailWorker'); // Adjust path

consumeEmailQueue().catch(error => {
    console.error("Email Worker failed to start:", error);
    process.exit(1); // Exit if setup fails
});

// Keep process alive (consumeEmailQueue already does this via consume)
console.log("Email Worker process started.");