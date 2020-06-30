const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');


const connectionPool = require('./infrastructure/db/connectionpool');
(async ()=>{
    await connectionPool.init();
})();

var paymentRouter = require('./application/routes/payment-router');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', paymentRouter);

process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.error('unhandledRejection', error.message, error.stack);
});

process.on('uncaughtException', error => {
    // Will print "uncaughtException err is not defined"
    console.error('uncaughtException', error.message, error.stack);
});

module.exports = app;