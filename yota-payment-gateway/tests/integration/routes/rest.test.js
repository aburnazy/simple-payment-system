const request = require('supertest');
const connectionPool = require('../../../infrastructure/db/connectionpool');
const app = require('../../../app');

jest.setTimeout(20000);

describe('Not existing routes', () => {
  beforeAll(async () => {
    await connectionPool.init();
  });
  afterAll(async () => {
    await connectionPool.closePool();
  });
  test('Not Found - 404', async () => {
    const response = await request(app).get('/notimplementedroute').expect(404);
    expect(response.body.message).toBeTruthy();
  });
});
