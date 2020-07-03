const checkStatusService = require('../../infrastructure/http/check-status-service');
const paymentRepository = require('../../infrastructure/db/payment-repository');
const Payment = require('../model/payment');
const PaymentOperation = require('../model/payment-operation');
const StatusError = require('../../application/errors/StatusError');
const { ERRORS } = require('../../common/constants');

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

    const { status, account: customerId } = await checkStatusService.check(
      msisdn,
    );

    if (!customerId) {
      throw new StatusError(ERRORS.NO_MSISDN_FOUND);
    }

    if (status) {
      newBalance = await operationProcessor.process(
        new PaymentOperation(customerId, paymentAmount),
      );
      paymentSucceeded = true;
    }

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

    if (!status) {
      throw new StatusError(ERRORS.CLOSED_ACCOUNT);
    }
    return newBalance;
  }
}

module.exports = PaymentService;
