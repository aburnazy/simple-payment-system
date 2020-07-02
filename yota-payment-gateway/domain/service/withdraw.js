const balanceRepository = require('../../infrastructure/db/balance-repository');
const StatusError = require('../../application/errors/StatusError');
const { ERRORS } = require('../../common/constants');

class Withdraw {
  static async process(payment) {
    const { amount, customerId } = payment;
    let updatedBalance;
    const balanceEntity = await Withdraw._findCustomerById(customerId);

    if (balanceEntity && balanceEntity.balance >= amount) {
      updatedBalance = balanceEntity.balance - amount;
      const result = await Withdraw._updateBalanceById(
        updatedBalance,
        balanceEntity.id,
      );
      // eslint-disable-next-line no-console
      console.log('Balance update result', result);
    } else {
      throw new StatusError(ERRORS.INSUFFICIENT_FUNDS);
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

module.exports = Withdraw;
