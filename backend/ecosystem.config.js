// ecosystem.config.js
module.exports = {
   apps : [
     {
       name   : "api-server",
       script : "./server.js",
       instances : "2", // या 'max'
       exec_mode : "cluster",
       env: {
         "NODE_ENV": "production",
       }
     },
     // { // --- WebSocket सर्वर एंट्री हटाएं ---
     //   name   : "websocket-server",
     //   script : "./src/ws.js",
     //   instances : "1",
     //   exec_mode : "fork",
     //   env: {
     //     "NODE_ENV": "production",
     //     "WS_PORT": 8080
     //   }
     // },
     {
       name   : "email-worker",
       script : "./src/worker/emailWorker.js",
       instances : "2",
       exec_mode : "fork",
       env: {
         "NODE_ENV": "production",
       }
     },
     {
       name   : "otp-worker",
       script : "./src/worker/otpWorker.js",
       instances : "4",
       exec_mode : "fork",
       env: {
         "NODE_ENV": "production",
       }
     }
   ]
 }