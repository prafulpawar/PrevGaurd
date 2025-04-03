// ecosystem.config.js
module.exports = {
   apps : [
     {
       name   : "api-server",
       script : "./server.js",
       instances : "3", // या 'max'
       exec_mode : "cluster",
       env: {
         "NODE_ENV": "production",
         "MONGO_URI": "mongodb+srv://prafuldukhi:u8Rn86IgXs7DxiK1@cluster0.uhxoonm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
         "ACCESS_TOKEN_SECRET": "DFUIHDSHIU",
         "REFRESH_TOKEN_SECRET": "DJJHUIDSHSSSWDT",
         
       }
     },
     
     {
       name   : "runemail-worker",
       script : "./src/worker/runemailWorker.js",
       instances : "8",
       exec_mode : "fork",
       env: {
         "NODE_ENV": "production",
         "EMAIL_USER":"prafuldukhi@gmail.com",
         "EMAIL_PASS":"yiukxdxaeoodzppf"
       }
     },
     {
       name   : "runotp-worker",
       script : "./src/worker/runotpWorker.js",
       instances : "8",
       exec_mode : "fork",
       env: {
         "NODE_ENV": "production",
         "MONGO_URI": "mongodb+srv://prafuldukhi:u8Rn86IgXs7DxiK1@cluster0.uhxoonm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
         "REDIS_HOST": "redis-18704.c283.us-east-1-4.ec2.redns.redis-cloud.com",
         "REDIS_PORT": "18704",
         "REDIS_PASSWORD": "Ilmeqi6xhZCIFreQbHRdUJmF9clbFgs1",
       }
     }
   ]
 }