const express = require('express');
const app = express();
const winston = require('winston');

//Single responsibility principle
require('./startup/validation')();
require('./startup/config')();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/prod')(app)

// Start server on env specified port OR 3000
const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}`));

module.exports = server;