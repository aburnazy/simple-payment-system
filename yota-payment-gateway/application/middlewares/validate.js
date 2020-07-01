const { get } = require('lodash');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const StatusError = require('../errors/StatusError');
const { ERRORS, OPERATION_CODE } = require('../../common/constants');

const validate = (req, res, next) => {
  console.log('validating');
  const { msisdn, paymentDate, operationCode, paymentAmount } = get(
    req,
    'body',
    {},
  );

  if (!msisdn || !paymentAmount || !paymentDate || !operationCode) {
    return next(new StatusError(ERRORS.REQUIRED_FIELD_MISSING));
  }

  try {
    phoneUtil.isValidNumber(phoneUtil.parse(`+${msisdn}`));
  } catch (e) {
    return next(new StatusError(ERRORS.INVALID_MSISDN));
  }

  if (
    Number.isNaN(new Date(paymentDate).getTime()) ||
    new Date(paymentDate) > new Date()
  ) {
    return next(new StatusError(ERRORS.INVALID_DATE));
  }

  if (
    operationCode !== OPERATION_CODE.PAYMENT &&
    operationCode !== OPERATION_CODE.WITHDRAWAL
  ) {
    return next(new StatusError(ERRORS.INVALID_OPERATION_CODE));
  }

  if (Number.isNaN(paymentAmount) || paymentAmount <= 0) {
    return next(new StatusError(ERRORS.INVALID_PAYMENT_AMOUNT));
  }
  console.log('done validating');
  return next();
};

module.exports = validate;
