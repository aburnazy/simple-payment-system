const checkStatusService = require('../../infrastructure/http/check-status-service');
const paymentRepository = require('../../infrastructure/db/payment-repository');
const Payment = require('../model/payment');
const PaymentOperation = require('../model/payment-operation');

class PaymentService {
  static async processPayment(
    msisdn,
    paymentDate,
    operationProcessor,
    operationCode,
    paymentAmount,
  ) {
    let newBalance;
    let paymentSucceeded = false;
    let customerId;

    const checkStatusResp = await checkStatusService.check(msisdn);

    if (checkStatusResp.account) {
      customerId = checkStatusResp.account;
    }

    if (customerId && checkStatusResp.status) {
      newBalance = await operationProcessor.process(
        new PaymentOperation(customerId, paymentAmount),
      );
      paymentSucceeded = true;
    }

    if (customerId) {
      const paymentResult = await paymentRepository.create(
        new Payment(
          null,
          new Date(paymentDate),
          operationCode,
          customerId,
          paymentAmount,
          paymentSucceeded,
        ),
      );
      // eslint-disable-next-line no-console
      console.log('Payment result: ', paymentResult);
    }
    return newBalance;
  }
}

module.exports = PaymentService;
