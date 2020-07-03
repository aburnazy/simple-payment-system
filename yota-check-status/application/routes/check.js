const router = require('express').Router();
const CustomerService = require('../../domain/service/customer-service');

router.get('/check/:msisdn', async (req, res, next) => {
  const { msisdn } = req.params;
  try {
    const customer = await CustomerService.getCustomer(msisdn);
    return res.json(customer);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
