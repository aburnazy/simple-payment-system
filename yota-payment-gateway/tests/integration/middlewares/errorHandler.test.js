const StatusError = require('../../../application/errors/StatusError');
const errorHandler = require('../../../application/middlewares/errorHandler');

// const err = new StatusError({ message: 'test', statusCode: 400, code: 10 });

describe('Error Handler Middleware', () => {
  test('Can handle if headers are sent', () => {
    const err = new Error('test');
    const res = {
      headersSent: true,
    };
    const next = jest.fn();
    errorHandler(err, {}, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
  test('Can handle StatusError', () => {
    const errData = { code: 8, message: 'test' };
    const err = new StatusError(errData);
    const jsonMockFunc = jest.fn();
    const statusMock = jest.fn(() => ({
      json: jsonMockFunc,
    }));
    const res = {
      status: statusMock,
    };
    const next = jest.fn();
    errorHandler(err, {}, res, next);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMockFunc).toHaveBeenCalledWith(errData);
  });
  test('Can handle generic Error', () => {
    const err = new Error('test');
    const jsonMockFunc = jest.fn();
    const statusMock = jest.fn(() => ({
      json: jsonMockFunc,
    }));
    const res = {
      status: statusMock,
    };
    errorHandler(err, {}, res, () => {});
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMockFunc).toHaveBeenCalledWith({
      code: 8,
      message: 'An internal error occurred. Please try again later.',
    });
  });
});
