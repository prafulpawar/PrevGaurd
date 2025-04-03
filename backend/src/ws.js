// src/ws.js (Modified Example - Needs careful implementation)
const WebSocket = require('ws');

let wssInstance = null; // Yahaan store karenge server instance
const clients = new Map(); // RequestID -> WebSocket connection

// Yeh function api-server call karega
function initWebSocket(serverInstance) {
    if (!wssInstance) {
        wssInstance = serverInstance;
        console.log('WebSocket Server Instance passed to ws.js');
        // Yahaan common event handlers laga sakte ho agar zaroori ho
        wssInstance.on('error', (error) => console.error('Shared WebSocket Server error:', error));
    }
}

// Yeh function api-server call karega jab naya connection aaye
function registerClient(requestId, ws) {
    clients.set(requestId, ws);
    console.log(`WebSocket client registered for Request ID: ${requestId}`);
    ws.on('close', () => {
        clients.delete(requestId);
        console.log(`WebSocket client deregistered for Request ID: ${requestId}`);
    });
     ws.on('error', (error) => {
        console.error(`WebSocket error for Request ID ${requestId}:`, error);
        clients.delete(requestId); // Remove on error too
     });
}

// Yeh function otp-worker call karega
function sendOtpStatus(requestId, status, data = {}) {
    if (!wssInstance) {
        console.error("WebSocket server instance not initialized in ws.js yet!");
        return;
    }
    const clientWs = clients.get(requestId);
    if (clientWs && clientWs.readyState === WebSocket.OPEN) {
        console.log(`Sending OTP status (${status}) to Request ID: ${requestId}`);
        clientWs.send(JSON.stringify({ type: 'otp_status', status, requestId, ...data }));
        // Shayad client ko delete nahi karna chahiye yahaan? Taki multiple status bhej sako? Decide based on need.
         // clients.delete(requestId); // Reconsider deleting immediately
    } else {
        console.log(`No open WebSocket client found for Request ID: ${requestId}. Status: ${status}`);
    }
}

module.exports = {
    initWebSocket,
    registerClient,
    sendOtpStatus,
};