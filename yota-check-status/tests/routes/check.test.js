const request = require('supertest');
const connectionPool = require('../../data/connectionpool');
const app = require('../../app');

const ACTIVE_CUSTOMER = 37491782745;
const INACTIVE_CUSTOMER = 37499009098;

const getUrl = (param) => `/check/${param}`;
jest.setTimeout(20000);

describe('Check Route', () => {
  beforeAll(async () => {
    await connectionPool.init();
  });
  test('Can get customer - Active', async () => {
    const response = await request(app)
      .get(getUrl(ACTIVE_CUSTOMER))
      .expect(200);
    const { account, status } = response.body;
    expect(account).toBe(1);
    expect(status).toBeTruthy();
  });
  test('Can get customer - Inactive', async () => {
    const response = await request(app)
      .get(getUrl(INACTIVE_CUSTOMER))
      .expect(200);
    const { account, status } = response.body;
    expect(account).toBe(2);
    expect(status).toBeFalsy();
  });
  test('Can get customer - Not existing', async () => {
    const response = await request(app).get(getUrl(12345)).expect(404);
    const { account, status, message } = response.body;
    expect(account).toBeFalsy();
    expect(status).toBeFalsy();
    expect(message).toBeTruthy();
  });
  test('Can get customer - Invalid msisdn', async () => {
    const response = await request(app)
      .get(getUrl('invalidvalue!'))
      .expect(404);
    const { account, status, message } = response.body;
    expect(account).toBeFalsy();
    expect(status).toBeFalsy();
    expect(message).toBeTruthy();
  });
});
