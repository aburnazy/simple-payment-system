const express = require('express');
const logger = require('morgan');
const connectionPool = require('./infrastructure/db/connectionpool');
const indexRouter = require('./application/routes/check');
const errorHandler = require('./application/middlewares/errorHandler');

(async () => {
  await connectionPool.init();
})();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(indexRouter);
app.use(errorHandler);

app.all('*', (req, res) =>
  res.status(404).json({ message: 'Not implemented' }),
);

module.exports = app;
