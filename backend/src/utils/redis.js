const Redis = require('ioredis');
const {redisConfig} = require('../config/config')
const redis = new Redis({
    host:redisConfig.host,
    port:redisConfig.port,
    password:redisConfig.password
})

redis.on("connect",() =>{
    console.log("Connected To Redis Cloud");
})

redis.on("error",(err)=>{
    console.log("Redis Error :",err)
})
module.exports = redis; 
