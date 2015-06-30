winston = require('winston');

var conf = require('./config.js');


logger = new winston.Logger({
  transports: [
    new winston.transports.Console({level:'debug'}),
  ],
  exitOnError: false
});

module.exports = logger;