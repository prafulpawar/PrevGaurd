const _config = {
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI
}

const config = Object.freeze(_config);
module.exports = config