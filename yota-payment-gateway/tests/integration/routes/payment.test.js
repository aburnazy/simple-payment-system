const request = require('supertest');
const connectionPool = require('../../../infrastructure/db/connectionpool');
const app = require('../../../app');
const checkStatusApp = require('../../../../yota-check-status/app');

const ACTIVE_CUSTOMER = 37491782745;
const INACTIVE_CUSTOMER = 37499009098;
const OPERATION_CODE_PAYMENT = 1;
const OPERATION_CODE_WITHDRAWAL = 2;
let server;

jest.setTimeout(20000);

describe('Payment Routes', () => {
  beforeAll(async () => {
    await connectionPool.init();
    server = await checkStatusApp.listen(3000);
  });
  afterAll(async () => {
    server.close();
  });
  test('Post payment - Active Customer', async () => {
    const paymentAmount = 1000;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: ACTIVE_CUSTOMER,
        paymentDate: new Date(),
        operationCode: OPERATION_CODE_PAYMENT,
        paymentAmount,
      })
      .expect(200);
    const {
      body: { code, operation, balance },
    } = response;
    expect(code).toBe(0);
    expect(operation).toBe(1);
    expect(balance).toBeGreaterThanOrEqual(paymentAmount);
  });
  test('Post payment - Inactive Customer', async () => {
    const paymentAmount = 1000;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: INACTIVE_CUSTOMER,
        paymentDate: new Date(),
        operationCode: OPERATION_CODE_PAYMENT,
        paymentAmount,
      })
      .expect(200);
    const {
      body: { code, operation, balance },
    } = response;
    expect(code).toBe(0);
    expect(operation).toBe(1);
    expect(balance).toBeFalsy();
  });
  test('Post payment - Not existing customer', async () => {
    const paymentAmount = 1000;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: 12345,
        paymentDate: new Date(),
        operationCode: OPERATION_CODE_PAYMENT,
        paymentAmount,
      })
      .expect(404);
    const { code } = response.body;
    expect(code).toBe(3);
  });
});
