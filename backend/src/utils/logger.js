// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), 
    winston.format.splat(),
    winston.format.json() 
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
  
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
  ],
});


if (process.env.NODE_ENV !== 'production') {
 
  logger.transports.find(t => t.name === 'console').level = 'debug';
} else {

     logger.transports.find(t => t.name === 'console').level = 'info';
}


module.exports = logger;