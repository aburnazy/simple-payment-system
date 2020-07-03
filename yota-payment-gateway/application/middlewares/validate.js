const { get } = require('lodash');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const StatusError = require('../errors/StatusError');
const { ERRORS, OPERATION_CODE } = require('../../common/constants');

const validate = (req, res, next) => {
  const { msisdn, date, operation, sum } = get(req, 'body', {});

  if (
    msisdn === undefined ||
    sum === undefined ||
    date === undefined ||
    operation === undefined
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

  if (Number.isNaN(new Date(date).getTime()) || new Date(date) > new Date()) {
    return next(new StatusError(ERRORS.INVALID_DATE));
  }

  if (
    operation !== OPERATION_CODE.PAYMENT &&
    operation !== OPERATION_CODE.WITHDRAWAL
  ) {
    return next(new StatusError(ERRORS.INVALID_OPERATION_CODE));
  }

  if (Number.isNaN(Number(sum)) || sum <= 0) {
    return next(new StatusError(ERRORS.INVALID_PAYMENT_AMOUNT));
  }
  return next();
};

module.exports = validate;
