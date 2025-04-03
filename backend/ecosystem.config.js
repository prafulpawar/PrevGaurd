// ecosystem.config.js
module.exports = {
   apps : [
     {
       name   : "api-server",        // ऐप का नाम
       script : "./server.js",        // मुख्य API सर्वर फ़ाइल
       instances : "2",              // Nginx में जितने सर्वर हैं (या 'max' सभी कोर के लिए)
       exec_mode : "cluster",        // क्लस्टर मोड लोड बैलेंसिंग के लिए
       env: {                        // पर्यावरण चर
         "NODE_ENV": "production",
         // PORT PM2 द्वारा स्वचालित रूप से बढ़ाया जा सकता है, 
         // या आप अलग-अलग पोर्ट निर्दिष्ट कर सकते हैं
         // "PORT": 5001 // पहले इंस्टेंस के लिए (या इसे छोड़ दें)
       },
       // आप दूसरे इंस्टेंस के लिए अलग env सेट कर सकते हैं, 
       // या PM2 को पोर्ट मैनेज करने दें (अक्सर आसान)
     },
     {
       name   : "websocket-server",
       script : "./src/ws.js", // WebSocket सर्वर फ़ाइल (अलग से चलाना होगा)
       instances : "1",        // अभी 1, जरूरत पड़ने पर बढ़ाएं
       exec_mode : "fork",     // WebSocket आमतौर पर फोर्क मोड में चलते हैं
       env: {
         "NODE_ENV": "production",
         // WebSocket सर्वर के लिए पोर्ट (Nginx में सेट किया गया)
         "WS_PORT": 8080 
       }
     },
     {
       name   : "email-worker",
       script : "./src/worker/emailWorker.js", // ईमेल वर्कर
       instances : "2",         // 2 वर्कर इंस्टेंस (या जरूरत अनुसार)
       exec_mode : "fork",      // वर्कर्स फोर्क मोड में चलते हैं
       env: {
         "NODE_ENV": "production",
       }
     },
     {
       name   : "otp-worker",
       script : "./src/worker/otpWorker.js",   // OTP वर्कर
       instances : "4",          // 4 वर्कर इंस्टेंस (या जरूरत अनुसार)
       exec_mode : "fork",       // वर्कर्स फोर्क मोड में चलते हैं
       env: {
         "NODE_ENV": "production",
       }
     }
   ]
 }