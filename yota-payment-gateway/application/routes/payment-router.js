const express = require('express');

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;

const paymentService = require('../../domain/service/payment-service');

const ERRORS = require('../../common/constants').ERRORS;
const OPERATION_CODE = require('../../common/constants').OPERATION_CODE;

const router = express.Router();

/* GET home page. */
router.post('/payment', async (req, res, next) => {
  const reqBody = req.body;
  const msisdn = reqBody.msisdn;
  const paymentDate = reqBody.paymentDate;
  const operationCode = reqBody.operationCode;
  const paymentAmount = reqBody.paymentAmount;

  try {
    validateRequest(req);

    let result = await paymentService.processPayment(msisdn, paymentDate, operationCode, paymentAmount);

    res.json({"code": 0, "operation": operationCode, "balance": result.newBalance});
  } catch (err) {
    res.status(err.statusCode).send(err);
  }
});

function validateRequest(req) {
  const reqBody = req.body;

  const msisdn = reqBody.msisdn;
  const paymentDate = reqBody.paymentDate;
  const operationCode = reqBody.operationCode;
  const paymentAmount = reqBody.paymentAmount;

  if(typeof msisdn == 'undefined' || typeof paymentDate == 'undefined' || typeof operationCode == 'undefined' || typeof paymentAmount == 'undefined') {
    throw ERRORS.REQUIRED_FIELD_MISSING;
  }

  try {
    phoneUtil.isValidNumber(phoneUtil.parse('+'+msisdn))
  } catch (e) {
    throw ERRORS.INVALID_MSISDN;
  }

  if( isNaN( new Date(paymentDate).getTime() ) || new Date(paymentDate) > new Date() ) {
    throw ERRORS.INVALID_DATE;
  }

  if(operationCode != OPERATION_CODE.PAYMENT && operationCode != OPERATION_CODE.WITHDRAWAL) {
    throw ERRORS.INVALID_OPERATION_CODE;
  }

  if( isNaN( paymentAmount ) || paymentAmount <= 0 ) {
    throw ERRORS.INVALID_PAYMENT_AMOUNT;
  }

}

module.exports = router;
