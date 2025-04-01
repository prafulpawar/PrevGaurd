const _config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_TOKEN:process.env.ACCESS_TOKEN,
    REFERSH_TOKEN:process.env.REFERSH_TOKEN
}

const config = Object.freeze(_config);
module.exports = config