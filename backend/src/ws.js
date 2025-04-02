const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map();

console.log(" WebSocket Server Running on ws://localhost:8080");

wss.on("connection", (ws) => {
    console.log("🔗 New WebSocket connection established");

    ws.on("message", (message) => {
        console.log(`📩 Received WebSocket Message: ${message}`);
        try {
            const { requestId } = JSON.parse(message);
            if (requestId) {
                clients.set(requestId, ws);
                console.log(`✅ Stored WebSocket for requestId: ${requestId}`);
            } else {
                console.log(" Received message without requestId");
            }
        } catch (error) {
            console.error(" Error parsing WebSocket message:", error);
        }
    });

    ws.on("close", () => console.log(" WebSocket connection closed"));
    ws.on("error", (err) => console.error(` WebSocket Error: ${err.message}`));
});

function sendOtpStatus(requestId, status) {
   

    const ws = clients.get(requestId);
    if (ws) {
        ws.send(JSON.stringify({ requestId, status }));
        console.log(`✅ Sent WebSocket response: { requestId: ${requestId}, status: ${status} }`);
        clients.delete(requestId);
    } else {
        console.log(`⚠️ No active WebSocket client found for requestId: ${requestId}`);
    }
}

module.exports = { sendOtpStatus };
