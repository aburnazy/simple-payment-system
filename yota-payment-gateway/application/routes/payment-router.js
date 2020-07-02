const router = require('express').Router();
const validate = require('../middlewares/validate');
const { OPERATION_CODE } = require('../../common/constants');
const Operations = require('../../domain/service/operations');
const PaymentService = require('../../domain/service/payment-service');

router.post('/payment', validate, async (req, res, next) => {
  const { msisdn, paymentDate, operationCode, paymentAmount } = req.body;
  const operationProcessor =
    operationCode === OPERATION_CODE.PAYMENT
      ? Operations.payment
      : Operations.withdraw;
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
