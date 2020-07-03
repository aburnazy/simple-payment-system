const StatusError = require('../../application/errors/StatusError');

const message = 'sample message';
const statusCode = 400;
const code = 1;
let statusError;

describe('Status Error', () => {
  beforeAll(() => {
    statusError = new StatusError({ message, code, statusCode });
  });
  test('StatusCode defaults to 500', () => {
    const error = new StatusError({});
    expect(error.statusCode).toBe(500);
  });
  test('Sets message', () => {
    expect(statusError.message).toBe(message);
  });
  test('Sets name', () => {
    expect(statusError.name).toBe('StatusError');
  });
  test('Sets status code', () => {
    expect(statusError.statusCode).toBe(statusCode);
  });
  test('Sets code', () => {
    expect(statusError.code).toBe(code);
  });
});
