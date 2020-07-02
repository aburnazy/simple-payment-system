const balanceRepository = require('../../infrastructure/db/balance-repository');
const Balance = require('../model/balance');

const paymentRepository = require('../../infrastructure/db/payment-repository');
const Payment = require('../model/payment');

const checkStatusService = require('../../infrastructure/http/check-status-service');

class PaymentService {
  static async processPayment(
    msisdn,
    paymentDate,
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

    if (checkStatusResp.status) {
      let balanceEntity = await balanceRepository.findByCustomerId(customerId);

      if (balanceEntity) {
        newBalance = balanceEntity.balance + paymentAmount;
        const updateResult = await balanceRepository.updateBalanceById(
          newBalance,
          balanceEntity.id,
        );
        // eslint-disable-next-line no-console
        console.log(updateResult);
      } else {
        newBalance = paymentAmount;
        balanceEntity = new Balance(null, customerId, paymentAmount);
        await balanceRepository.create(balanceEntity);
      }

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
      console.log(paymentResult);
    }
    return {
      newBalance,
    };
  }
}

module.exports = PaymentService;
