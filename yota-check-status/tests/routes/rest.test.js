const request = require('supertest');
const connectionPool = require('../../data/connectionpool');
const app = require('../../app');

jest.setTimeout(20000);

describe('Not existing routes', () => {
  beforeAll(async () => {
    await connectionPool.init();
  });
  test('Not Found - 404', async () => {
    const response = await request(app).get('/notimplementedroute').expect(404);
    expect(response.body.message).toBeTruthy();
  });
});
