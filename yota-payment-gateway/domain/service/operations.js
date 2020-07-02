const balanceRepository = require('../../infrastructure/db/balance-repository');
const Balance = require('../model/balance');
const StatusError = require('../../application/errors/StatusError');
const { ERRORS } = require('../../common/constants');

class Operations {
  static async payment(customerId, amount) {
    const balanceEntity = await Operations._findCustomerById(customerId);
    let updatedBalance;

    if (balanceEntity) {
      updatedBalance = balanceEntity.balance + amount;
      const result = await Operations._updateBalanceById(
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

  static async withdraw(customerId, amount) {
    let updatedBalance;
    const balanceEntity = await Operations._findCustomerById(customerId);

    if (balanceEntity && balanceEntity.balance >= amount) {
      updatedBalance = balanceEntity.balance - amount;
      const result = await Operations._updateBalanceById(
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

module.exports = Operations;
