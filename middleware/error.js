const winston = require('winston');

// Error middleware for requests
module.exports = function(err, req, res, next){
    // log, error, warn, info, debug, silly
    winston.error( err.message, err ); //store optional metadata

    res.status(500).send("Something failed.")
};
