const appAPI = require('./src/app');

const configData = require('./src/config/config');


// appAPI.use((req, res, next) => {
//     console.log("Host:", req.headers.host);
//     console.log("Client IP:", req.headers["x-real-ip"]);
//     console.log("Forwarded IP:", req.headers["x-forwarded-for"]);
//     next();
// });

// appAPI.set('trust proxy', 1); 



appAPI.listen(process.env.PORT, () => {
    console.log(`🚀 Server Is Running On ${process.env.PORT}`);
});


