/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import testData from '../_testData_/testData';

describe('Admin tests', () => {
  beforeAll(async () => {
    const res = await request(app).post('/api/auth/signup').send(testData.branSignup);
    testData.branToken = res.body.data.token;
  });
  afterAll(async () => {
    await db.sync({ force: true });
    await db.close();
  });
  it('PATCH/ should make an admin', async () => {
    const res = await request(app)
      .patch('/api/auth/users/toggleadmin')
      .set('Authorization', `Bearer ${testData.branToken}`)
      .send(testData.makeBranAdmin);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.isAdmin).toEqual(true);
  });
  it('POST/ should not make an admin with wrong key', async () => {
    const res = await request(app)
      .patch('/api/auth/users/toggleadmin')
      .set('Authorization', `Bearer ${testData.branToken}`)
      .send(testData.makeBranAdminInv);
    expect(res.status).toEqual(403);
    expect(res.body).toHaveProperty('error');
  });
  it('POST/ should login an admin', async () => {
    const res = await request(app).post('/api/auth/login').send(testData.branLogin);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
  });
});
