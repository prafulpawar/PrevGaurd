const WebSocket = require('ws');

function connectWebSocket() {
    const ws = new WebSocket('ws://localhost:8080');

    ws.on('open', () => {
        console.log('🟢 Connected to WebSocket Server');
        ws.send('Hello Server!');
    });

    ws.on('message', (message) => {
        console.log(`📩 Received from Server: ${message}`);
    });

    ws.on('close', () => {
        console.log('🔴 Disconnected from WebSocket Server, Reconnecting...');
        setTimeout(connectWebSocket, 3000);  // Reconnect after 3 seconds
    });

    ws.on('error', (err) => {
        console.error(`❌ WebSocket Error: ${err.message}`);
    });
}

// Export function to be used in app
module.exports = connectWebSocket;

