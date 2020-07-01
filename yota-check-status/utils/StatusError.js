class StatusError extends Error {
  constructor({ message, statusCode, code }) {
    super(message);
    this.statusCode = statusCode || 500;
    this.code = code;
  }
}

module.exports = StatusError;
