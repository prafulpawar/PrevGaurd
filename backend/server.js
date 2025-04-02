const app = require('./src/app');
const sendOtpStatus = require('./src/ws');  // Import WebSocket function
const configData = require('./src/config/config');

app.use((req, res, next) => {
    console.log("Host:", req.headers.host);
    console.log("Client IP:", req.headers["x-real-ip"]);
    console.log("Forwarded IP:", req.headers["x-forwarded-for"]);
    next();
});



// ✅ Test Route to Trigger WebSocket Response
app.post("/test-websocket", (req, res) => {
    const { requestId, status } = req.body;

    if (!requestId || !status) {
        return res.status(400).json({ message: "requestId and status are required" });
    }

    sendOtpStatus(requestId, status);
    res.json({ message: "WebSocket response sent" });
});


app.listen(configData.configData.PORT, () => {
    console.log(`🚀 Server Is Running On ${configData.configData.PORT}`);
});

// Start WebSocket Connection Automatically
