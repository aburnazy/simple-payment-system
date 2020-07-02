const balanceRepository = require('../../infrastructure/db/balance-repository');
const Balance = require('../model/balance');

class Payment {
  static async process(payment) {
    const { amount, customerId } = payment;
    const balanceEntity = await Payment._findCustomerById(customerId);
    let updatedBalance;

    if (balanceEntity) {
      updatedBalance = balanceEntity.balance + amount;
      const result = await Payment._updateBalanceById(
        updatedBalance,
        balanceEntity.id,
      );
      // eslint-disable-next-line no-console
      console.log('Balance update result', result);
    } else {
      updatedBalance = amount;
      const newBalanceEntity = new Balance(null, customerId, amount);
      await balanceRepository.create(newBalanceEntity);
    }
    return updatedBalance;
  }

  static async _findCustomerById(customerId) {
    return balanceRepository.findByCustomerId(customerId);
  }

  static async _updateBalanceById(balance, balanceId) {
    return balanceRepository.updateBalanceById(balance, balanceId);
  }
}

module.exports = Payment;
