const { set } = require('lodash');
const ValidationMiddleware = require('../../../application/middlewares/validate');
const { ERRORS } = require('../../../common/constants');
const StatusError = require('../../../application/errors/StatusError');

const VALID_MSISDN = 37491782745;
const INVALID_MSISDN_NUMBER = 123;
const INVALID_MSISDN_STRING = 'notavalidvalue!';
const VALID_OPERATION_CODE = 1;
const INVALID_OPERATION_CODE = 0;
const VALID_DATE = new Date();
const INVALID_DATE = new Date().setFullYear(2100);
const VALID_PAYMENT_AMOUT = 1000;
const INVALID_PAYMENT_AMOUT = 'notanumber!';
const NEGATIVE_PAYMENT_AMOUNT = -1000;

const next = jest.fn();
let req;

describe('Validation Middleware', () => {
  beforeEach(() => {
    req = {
      body: {
        msisdn: VALID_MSISDN,
        sum: VALID_PAYMENT_AMOUT,
        date: VALID_DATE,
        operation: VALID_OPERATION_CODE,
      },
    };
  });
  afterEach(() => {
    next.mockReset();
  });
  test('Can Validate msisdn - Invalid number', () => {
    set(req, 'body.msisdn', INVALID_MSISDN_NUMBER);
    ValidationMiddleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(new StatusError(ERRORS.INVALID_MSISDN));
  });
  test('Can Validate msisdn - Invalid string', () => {
    set(req, 'body.msisdn', INVALID_MSISDN_STRING);
    ValidationMiddleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(new StatusError(ERRORS.INVALID_MSISDN));
  });
  test('Can Validate payment date - Future date', () => {
    set(req, 'body.date', INVALID_DATE);
    ValidationMiddleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(new StatusError(ERRORS.INVALID_DATE));
  });
  test('Can Validate payment date - Invalid date', () => {
    set(req, 'body.date', 'notadate!');
    ValidationMiddleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(new StatusError(ERRORS.INVALID_DATE));
  });
  test('Can Validate operation code - Invalid value', () => {
    set(req, 'body.operation', INVALID_OPERATION_CODE);
    ValidationMiddleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(
      new StatusError(ERRORS.INVALID_OPERATION_CODE),
    );
  });
  test('Can Validate payment amount - Negative value', () => {
    set(req, 'body.sum', NEGATIVE_PAYMENT_AMOUNT);
    ValidationMiddleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(
      new StatusError(ERRORS.INVALID_PAYMENT_AMOUNT),
    );
  });
  test('Can Validate payment amount - String value', () => {
    set(req, 'body.sum', INVALID_PAYMENT_AMOUT);
    ValidationMiddleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(
      new StatusError(ERRORS.INVALID_PAYMENT_AMOUNT),
    );
  });
  test('Can Validate fields existence - msisdn', () => {
    set(req, 'body.msisdn', undefined);
    ValidationMiddleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(
      new StatusError(ERRORS.REQUIRED_FIELD_MISSING),
    );
  });
  test('Can Validate fields existence - paymentAmount', () => {
    set(req, 'body.sum', undefined);
    ValidationMiddleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(
      new StatusError(ERRORS.REQUIRED_FIELD_MISSING),
    );
  });
  test('Can Validate fields existence - paymentDate', () => {
    set(req, 'body.date', undefined);
    ValidationMiddleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(
      new StatusError(ERRORS.REQUIRED_FIELD_MISSING),
    );
  });
  test('Can Validate fields existence - operationCode', () => {
    set(req, 'body.operation', undefined);
    ValidationMiddleware(req, {}, next);
    expect(next).toHaveBeenCalledWith(
      new StatusError(ERRORS.REQUIRED_FIELD_MISSING),
    );
  });
});
