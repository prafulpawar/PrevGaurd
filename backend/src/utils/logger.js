const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', // लॉग लेवल सेट करें (info, debug, warn, error)
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // टाइमस्टैम्प जोड़ें
    winston.format.errors({ stack: true }), // एरर स्टैक दिखाएं
    winston.format.splat(),
    winston.format.json() // JSON फॉर्मेट में लॉग करें
  ),
  defaultMeta: { service: 'otp-worker' }, // सभी लॉग्स में यह मेटाडेटा जोड़ें
  transports: [
    // कंसोल पर लॉग करें
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // रंगों का प्रयोग करें
        winston.format.simple() // सरल फॉर्मेट कंसोल के लिए
      )
    }),
    // (वैकल्पिक) फ़ाइल में लॉग करें
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});

module.exports = logger;