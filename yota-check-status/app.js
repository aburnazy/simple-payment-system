const express = require('express');
const path = require('path');
const logger = require('morgan');

const connectionPool = require('./data/connectionpool');
(async ()=>{
    await connectionPool.init();
})();

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

module.exports = app;
