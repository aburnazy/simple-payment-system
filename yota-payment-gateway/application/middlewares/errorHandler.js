const { pick } = require('lodash');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  // eslint-disable-next-line no-console
  console.log(err);
  return res
    .status(err.statusCode || 500)
    .json(pick(err, ['code', 'message', 'statusCode']));
};

module.exports = errorHandler;
