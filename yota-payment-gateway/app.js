const express = require('express');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./doc/swagger.yml');

const ErrorHandler = require('./application/middlewares/errorHandler');
const paymentRouter = require('./application/routes/payment-router');
const connectionPool = require('./infrastructure/db/connectionpool');

(async () => {
  await connectionPool.init();
})();

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(paymentRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', express.Router());

app.use(ErrorHandler);

app.all('*', (req, res) =>
  res.status(404).json({ message: 'Not implemented' }),
);

process.on('unhandledRejection', (error) => {
  // Will print "unhandledRejection err is not defined"
  // eslint-disable-next-line no-console
  console.error('unhandledRejection', error.message, error.stack);
});

process.on('uncaughtException', (error) => {
  // Will print "uncaughtException err is not defined"
  // eslint-disable-next-line no-console
  console.error('uncaughtException', error.message, error.stack);
});

module.exports = app;
