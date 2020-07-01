class StatusError extends Error {
  constructor({ message, statusCode, code }, ...params) {
    super(params);
    this.name = 'Status Error';
    this.statusCode = statusCode || 500;
    this.code = code;
    this.message = message;
  }
}

module.exports = StatusError;
