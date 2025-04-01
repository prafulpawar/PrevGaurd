const _config = {
    PORT:process.env.PORT,
    MONO_URI:process.env.MONO_URI
}

const config = Object.freeze(_config);
module.exports = config