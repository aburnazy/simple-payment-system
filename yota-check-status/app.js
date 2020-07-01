const express = require('express');
const logger = require('morgan');
const { pick } = require('lodash');
const connectionPool = require('./data/connectionpool');
const indexRouter = require('./routes/check');

(async () => {
  await connectionPool.init();
})();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(indexRouter);
app.use((err, req, res, next) => {
  if (req.headersSent) {
    return next(err);
  }
  return res
    .status(err.statusCode || 500)
    .json(pick(err, ['code', 'message', 'statusCode']));
});

module.exports = app;
