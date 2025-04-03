const Redis = require('ioredis');
const redis = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD
})

redis.on("connect",() =>{
    console.log("Connected To Redis Cloud");
})

redis.on("error",(err)=>{
    console.log("Redis Error :",err)
})
module.exports = redis; 
