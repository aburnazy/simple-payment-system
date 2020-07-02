const StatusError = require('./StatusError');

const handler = (err, req, res, next) => {
  if (req.headersSent) {
    return next(err);
  }
  if (err instanceof StatusError) {
    const { message, statusCode } = err;
    return res.status(statusCode).json({
      message,
    });
  }
  return res
    .status(500)
    .json({ message: 'An internal error occurred. Please try again later.' });
};

module.exports = handler;
