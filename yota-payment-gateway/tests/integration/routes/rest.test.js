const request = require('supertest');
const app = require('../../../app');

jest.setTimeout(20000);

describe('Not existing routes', () => {
  test('Not Found - 404', async () => {
    const response = await request(app).get('/notimplementedroute').expect(404);
    expect(response.body.message).toBeTruthy();
  });
});
