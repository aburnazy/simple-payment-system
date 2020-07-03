const { get } = require('lodash');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const StatusError = require('../errors/StatusError');
const { ERRORS, OPERATION_CODE } = require('../../common/constants');

const validate = (req, res, next) => {
  const { msisdn, paymentDate, operationCode, paymentAmount } = get(
    req,
    'body',
    {},
  );

  if (
    msisdn === undefined ||
    paymentAmount === undefined ||
    paymentDate === undefined ||
    operationCode === undefined
  ) {
    return next(new StatusError(ERRORS.REQUIRED_FIELD_MISSING));
  }

  let isValidMSISDN;
  try {
    isValidMSISDN = phoneUtil.isValidNumber(phoneUtil.parse(`+${msisdn}`));
    if (!isValidMSISDN) {
      return next(new StatusError(ERRORS.INVALID_MSISDN));
    }
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

  if (Number.isNaN(Number(paymentAmount)) || paymentAmount <= 0) {
    return next(new StatusError(ERRORS.INVALID_PAYMENT_AMOUNT));
  }
  return next();
};

module.exports = validate;
