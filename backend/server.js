const app = require('./src/app');
const configData = require('./src/config/config');

app.use((req, res, next) => {
    console.log("Host:", req.headers.host);
    console.log("Client IP:", req.headers["x-real-ip"]);
    console.log("Forwarded IP:", req.headers["x-forwarded-for"]);
    next();
});


app.listen(configData.configData.PORT,(req,res)=>{
    console.log(`Server Is Running On ${configData.configData.PORT}`)
   
})