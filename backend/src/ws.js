const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map(); // Store active clients with requestId mapping

wss.on("connection", (ws) => {
    console.log("🔗 New WebSocket connection established");

    ws.on("message", (message) => {
        const { requestId } = JSON.parse(message);
        if (requestId) {
            clients.set(requestId, ws); // Store WebSocket connection with requestId
        }
    });

    ws.on("close", () => {
        console.log("❌ WebSocket connection closed");
    });
});

function sendOtpStatus(requestId, status) {
    const ws = clients.get(requestId);
    if (ws) {
        ws.send(JSON.stringify({ requestId, status }));
        clients.delete(requestId); // Remove after sending response
    }
}

module.exports = { sendOtpStatus };
