const express = require('express');
const logger = require('morgan');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./doc/swagger.yml');

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', express.Router());

app.use(errorHandler);

app.all('*', (req, res) =>
  res.status(404).json({ message: 'Not implemented' }),
);

module.exports = app;
