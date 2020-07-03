const CustomerRepository = require('../../infrastructure/db/customer-repository');
const StatusError = require('../../application/errors/StatusError');
const Customer = require('../model/customer');
const { CUSTOMER_STATUS, ERRORS } = require('../../common/constants');

class CustomerService {
  static async getCustomer(msisdn) {
    const result = await CustomerRepository.get(new Customer(null, msisdn));

    if (!result.rows.length) {
      throw new StatusError(ERRORS.NO_CUSTOMER_FOUND);
    }

    const { CUSTOMER_ID: account, STATUS: status } = result.rows[0];
    return {
      account,
      status: Number(status) === CUSTOMER_STATUS.ACTIVE,
    };
  }
}

module.exports = CustomerService;
