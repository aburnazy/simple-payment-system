const { pick } = require('lodash');
const StatusError = require('../errors/StatusError');
const { ERRORS } = require('../../common/constants');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof StatusError) {
    const { code, message, statusCode } = err;
    return res.status(statusCode).json({
      code,
      message,
    });
  }
  return res.status(500).json(pick(ERRORS.INTERNAL_ERROR, ['code', 'message']));
};

module.exports = errorHandler;
