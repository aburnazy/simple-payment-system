const connectionPool = require('../../../infrastructure/db/connectionpool');
const CustomerService = require('../../../domain/service/customer-service');
const StatusError = require('../../../application/errors/StatusError');

const ACTIVE_CUSTOMER = 37491782745;
const INACTIVE_CUSTOMER = 37499009098;

describe('Customer service', () => {
  beforeAll(async () => {
    await connectionPool.init();
  });
  afterAll(async () => {
    await connectionPool.closePool();
  });
  test('Can get active customer', async () => {
    const { account, status } = await CustomerService.getCustomer(
      ACTIVE_CUSTOMER,
    );
    expect(account).toBeTruthy();
    expect(typeof account).toBe('number');
    expect(status).toBeTruthy();
  });
  test('Can get inactive customer', async () => {
    const { account, status } = await CustomerService.getCustomer(
      INACTIVE_CUSTOMER,
    );
    expect(account).toBeTruthy();
    expect(typeof account).toBe('number');
    expect(status).toBeFalsy();
  });
  test('Can get not existing customer', async () => {
    const helper = async () => {
      await CustomerService.getCustomer('notvalidmsisdn!');
    };
    await expect(helper()).rejects.toThrowError(StatusError);
  });
});
