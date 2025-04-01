const app = require('./src/app');
const config = require('./src/config/config');
app.listen(config.PORT,()=>{
    console.log(`Server Is Running On ${config.PORT}`)
})