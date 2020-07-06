const request = require('supertest');
const connectionPool = require('../../../infrastructure/db/connectionpool');
const config = require('../../../app.config');
const app = require('../../../app');
const checkStatusApp = require('../../../../yota-check-status/app');
const { checkStatusPort } = require('../../../app.config');

const ACTIVE_CUSTOMER = 37499001122;
const INACTIVE_CUSTOMER = 37499334455;
const NOT_EXISTING_CUSTOMER = 37499123456;
const OPERATION_CODE_PAYMENT = 1;
const OPERATION_CODE_WITHDRAWAL = 2;
const date = new Date();
let server;

jest.setTimeout(20000);

const acceptClosedAccountPayment = (value) => {
  config.application.acceptClosedAccountPayments = value;
};

describe('Payment Routes', () => {
  beforeAll(async () => {
    await connectionPool.init();
    server = await checkStatusApp.listen(checkStatusPort);
  });
  afterAll(async () => {
    await connectionPool.closePool();
    server.close();
  });
  test('Post payment - Active Customer', async () => {
    acceptClosedAccountPayment(false);
    const paymentAmount = 1000;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: ACTIVE_CUSTOMER,
        date,
        operation: OPERATION_CODE_PAYMENT,
        sum: paymentAmount,
      })
      .expect(200);
    const {
      body: { code, operation, balance },
    } = response;
    expect(code).toBe(0);
    expect(operation).toBe(OPERATION_CODE_PAYMENT);
    expect(balance).toBeGreaterThanOrEqual(paymentAmount);
  });
  test('Post payment - Inactive Customer', async () => {
    acceptClosedAccountPayment(false);
    const paymentAmount = 1000;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: INACTIVE_CUSTOMER,
        date,
        operation: OPERATION_CODE_PAYMENT,
        sum: paymentAmount,
      })
      .expect(422);
    const {
      body: { code, message },
    } = response;
    expect(code).toBe(9);
    expect(message).toBeTruthy();
  });
  test('Post payment - Not existing customer', async () => {
    acceptClosedAccountPayment(false);
    const paymentAmount = 1000;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: NOT_EXISTING_CUSTOMER,
        date,
        operation: OPERATION_CODE_PAYMENT,
        sum: paymentAmount,
      })
      .expect(404);
    const { code } = response.body;
    expect(code).toBe(3);
  });
  test('Post withdraw - Active customer', async () => {
    acceptClosedAccountPayment(false);
    const paymentAmount = 100;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: ACTIVE_CUSTOMER,
        date,
        operation: OPERATION_CODE_WITHDRAWAL,
        sum: paymentAmount,
      })
      .expect(200);
    const {
      body: { code, operation, balance },
    } = response;
    expect(code).toBe(0);
    expect(operation).toBe(OPERATION_CODE_WITHDRAWAL);
    expect(balance).toBeTruthy();
  });
  test('Post withdraw - Active customer - Insufficient funds', async () => {
    acceptClosedAccountPayment(false);
    const paymentAmount = 100000;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: ACTIVE_CUSTOMER,
        date,
        operation: OPERATION_CODE_WITHDRAWAL,
        sum: paymentAmount,
      })
      .expect(402);
    expect(response.body.code).toBe(6);
  });
  test('Post withdraw - Inactive customer', async () => {
    acceptClosedAccountPayment(false);
    const paymentAmount = 100;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: INACTIVE_CUSTOMER,
        date,
        operation: OPERATION_CODE_WITHDRAWAL,
        sum: paymentAmount,
      })
      .expect(422);
    const {
      body: { code, message },
    } = response;
    expect(code).toBe(9);
    expect(message).toBeTruthy();
  });
  test('Post withdraw - Not existing customer', async () => {
    acceptClosedAccountPayment(false);
    const paymentAmount = 1000;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: NOT_EXISTING_CUSTOMER,
        date,
        operation: OPERATION_CODE_WITHDRAWAL,
        sum: paymentAmount,
      })
      .expect(404);
    expect(response.body.code).toBe(3);
  });
  test('Post payment - Inactive Customer - Payment - Accepting closed account', async () => {
    acceptClosedAccountPayment(true);
    const paymentAmount = 1000;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: INACTIVE_CUSTOMER,
        date,
        operation: OPERATION_CODE_PAYMENT,
        sum: paymentAmount,
      })
      .expect(200);
    const {
      body: { code, operation, balance },
    } = response;
    expect(code).toBe(0);
    expect(operation).toBe(OPERATION_CODE_PAYMENT);
    expect(balance).toBeTruthy();
  });
  test('Post payment - Inactive Customer - Withdraw - Accepting closed account', async () => {
    acceptClosedAccountPayment(true);
    const paymentAmount = 10;
    const response = await request(app)
      .post('/payment')
      .send({
        msisdn: INACTIVE_CUSTOMER,
        date,
        operation: OPERATION_CODE_WITHDRAWAL,
        sum: paymentAmount,
      })
      .expect(200);
    const {
      body: { code, operation, balance },
    } = response;
    expect(code).toBe(0);
    expect(operation).toBe(OPERATION_CODE_WITHDRAWAL);
    expect(balance).toBeTruthy();
  });
});
