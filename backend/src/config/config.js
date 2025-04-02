const _config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_TOKEN:process.env.ACCESS_TOKEN,
    REFERSH_TOKEN:process.env.REFERSH_TOKEN
}
const redis_Config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD

}
const _nodemailer ={
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_PASS:process.env.EMAIL_PASS
}


const configData = Object.freeze(_config);
const redisConfig = Object.freeze(redis_Config)
const nodemailers = Object.freeze(_nodemailer);
module.exports = {
    configData,
    redisConfig,
    nodemailers
} 