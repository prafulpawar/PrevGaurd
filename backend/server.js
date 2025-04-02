const app = require('./src/app');
const connectWebSocket = require('./src/ws');  // Import WebSocket function
const configData = require('./src/config/config');

app.use((req, res, next) => {
    console.log("Host:", req.headers.host);
    console.log("Client IP:", req.headers["x-real-ip"]);
    console.log("Forwarded IP:", req.headers["x-forwarded-for"]);
    next();
});

connectWebSocket();

app.listen(configData.configData.PORT, () => {
    console.log(`🚀 Server Is Running On ${configData.configData.PORT}`);
});

// Start WebSocket Connection Automatically
