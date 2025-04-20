const dotenv = require('dotenv');
dotenv.config()

const express = require('express');
const connectDB = require('../src/utils/db');
connectDB()
const router = require('./routes/user.routes');
const breachRouter = require('./routes/breachRoute'); 
const fackData = require('./routes/fackData')
const breachData = require('./routes/breachRoute')
const shareData = require('./routes/sharedRoute')
const vaultData = require('./routes/vaultRoutes')
const rebbitMQ = require('./services/rabbitMQ')
const appAPI = express();
const cors = require('cors')

 appAPI.use(cors())
// appAPI.set('trust proxy', true);


appAPI.use(express.json());
appAPI.use(express.urlencoded({extended:true}));

// appAPI.use((req, res, next) => {
//     console.log('Client IP:', req.ip);
//     console.log('Forwarded IPs:', req.ips);
//     next();
// });


// Default route
appAPI.get('/', (req, res) => {
    res.send('Server Is Running');
});



appAPI.use('/api',router);
appAPI.use('/api',breachRouter)
appAPI.use('/api',fackData)
appAPI.use('/api',breachData)
appAPI.use('/api',shareData)
appAPI.use('/api',vaultData)
module.exports = appAPI;


