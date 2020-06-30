const balanceRepository = require('../../infrastructure/db/balance-repository');
const Balance = require('../../domain/model/balance');

const paymentRepository = require('../../infrastructure/db/payment-repository');
const Payment = require('../../domain/model/payment');

const checkStatusService = require('../../infrastructure/http/check-status-service');

class PaymentService {
    async processPayment(msisdn, paymentDate, operationCode, paymentAmount) {
        var newBalance, paymentSucceeded = false, customerId;

        let checkStatusResp = await checkStatusService.check(msisdn);

        if(checkStatusResp.account) {
            customerId = checkStatusResp.account;
        }

        if(checkStatusResp.status) {
            let balanceEntity = await  balanceRepository.findByCustomerId(customerId);

            if(balanceEntity) {
                newBalance = balanceEntity.balance+paymentAmount;
                let updateResult = await balanceRepository.updateBalanceById(newBalance, balanceEntity.id);
                console.log(updateResult);
            } else {
                newBalance = paymentAmount;
                balanceEntity = new Balance(null, customerId, paymentAmount);
                let createResult = await balanceRepository.create(balanceEntity);
            }

            paymentSucceeded = true;
        }

        if(customerId) {
            let paymentResult = await paymentRepository.create( new Payment(null, new Date(paymentDate), operationCode, customerId, paymentAmount, paymentSucceeded) );
            console.log(paymentResult);
        }
        let result = {
          "newBalance": newBalance
        };

        return result;
    }
}

module.exports = new PaymentService();