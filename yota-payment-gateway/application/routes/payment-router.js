const router = require('express').Router();
const validate = require('../middlewares/validate');
const PaymentService = require('../../domain/service/payment-service');

router.post('/payment', validate, async (req, res, next) => {
  const { msisdn, paymentDate, operationCode, paymentAmount } = req.body;
  try {
    const { newBalance } = await PaymentService.processPayment(
      msisdn,
      paymentDate,
      operationCode,
      paymentAmount,
    );
    return res.json({ code: 0, operation: operationCode, balance: newBalance });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
