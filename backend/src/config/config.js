const _config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_TOKEN:process.env.ACCESS_TOKEN,
    REFERSH_TOKEN:process.env.REFERSH_TOKEN
}
const redis_Config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD

}
const config = Object.freeze(_config);
const redisConfig = Object.freeze(redis_Config)

module.exports = {
    config,
    redisConfig,
} 