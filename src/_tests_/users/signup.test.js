/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import testData from '../_testData_/testData';

describe('User tests', () => {
  afterAll(async () => {
    await db.sync({ force: true });
    await db.close();
  });
  it('POST/ should signup a user', async (done) => {
    const res = await request(app).post('/api/auth/signup').send(testData.branSignup);
    expect(res.status).toEqual(201);
    done();
  });
  it('POST/ should not signup an already existing user', async (done) => {
    const res = await request(app).post('/api/auth/signup').send(testData.branSignup);
    expect(res.status).toEqual(409);
    expect(res.body).toHaveProperty('error');
    done();
  });
});
