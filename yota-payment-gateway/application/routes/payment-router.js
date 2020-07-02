const router = require('express').Router();
const validate = require('../middlewares/validate');
const { OPERATION_CODE } = require('../../common/constants');
const Withdraw = require('../../domain/service/withdraw');
const Payment = require('../../domain/service/payment');
const PaymentService = require('../../domain/service/payment-service');

router.post('/payment', validate, async (req, res, next) => {
  const { msisdn, paymentDate, operationCode, paymentAmount } = req.body;
  const operationProcessor =
    operationCode === OPERATION_CODE.PAYMENT ? Payment : Withdraw;
  try {
    const newBalance = await PaymentService.processPayment(
      msisdn,
      paymentDate,
      operationProcessor,
      operationCode,
      paymentAmount,
    );
    return res.json({ code: 0, operation: operationCode, balance: newBalance });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
