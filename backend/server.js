const appAPI = require('./src/app');

const configData = require('./src/config/config');
const express = require('express')

// api-server main file (Example Snippet)
const http = require('http');
const { WebSocketServer } = require('ws');
const { initWebSocket, registerClient } = require('./src/ws'); // Path adjust karna
// ... other requires like express ...


const server = http.createServer(appAPI);
const WS_PORT = 5550; // Ya process.env se

// Server yahaan banega SIRF EK BAAR
const wss = new WebSocketServer({ server: server }); // Ya { server } agar Express ke saath jodna hai

// ws.js ko instance pass karo
initWebSocket(wss);

console.log(`✅ WebSocket Server Running on ws://localhost:${WS_PORT}`); // Log yahaan karo

wss.on('connection', (ws, req) => {
    // Request ID nikalne ka logic (e.g., from URL query parameter)
    let requestId = null;
    try {
       // Example: ws://localhost:5550?requestId=12345
       const url = new URL(req.url, `ws://${req.headers.host}`);
       requestId = url.searchParams.get('requestId');
    } catch(e) {
       console.error("Could not parse request URL for requestId", e);
    }


    if (requestId) {
        console.log(`API Server: Connection with Request ID: ${requestId}`);
        registerClient(requestId, ws); // ws.js mein client ko store karo
    } else {
        console.log("API Server: Connection without Request ID.");
        // Decide how to handle - maybe close it? ws.close();
    }

    ws.on('message', (message) => {
        console.log('API Server received message:', message.toString());
        // Handle client messages if needed
    });

    // close aur error handlers 'registerClient' mein bhi hain, yahaan basic logging rakh sakte ho
     ws.on('close', () => console.log(`API Server: Connection closed (Request ID: ${requestId || 'N/A'})`));
     ws.on('error', (err) => console.error(`API Server: WebSocket Error (Request ID: ${requestId || 'N/A'}): ${err.message}`));
});

// Start HTTP server etc...
// app.listen(...) or server.listen(...)
appAPI.use((req, res, next) => {
    console.log("Host:", req.headers.host);
    console.log("Client IP:", req.headers["x-real-ip"]);
    console.log("Forwarded IP:", req.headers["x-forwarded-for"]);
    next();
});




appAPI.listen(configData.configData.PORT, () => {
    console.log(`🚀 Server Is Running On ${configData.configData.PORT}`);
});

// Start WebSocket Connection Automatically
