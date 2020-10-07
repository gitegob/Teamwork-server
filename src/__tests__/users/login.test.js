/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import testData from '../_testData_/testData';

const loginTests = () => {
  describe('User tests', () => {
    beforeAll(async () => {
      await request(app).post('/api/auth/signup').send(testData.branSignup);
    });
    afterAll(async () => {
      await db.sync({ force: true });
      // await db.close();
    });
    it('POST/ should login a user', async () => {
      const res = await request(app).post('/api/auth/login').send(testData.branLogin);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('token');
    });
    it('POST/ should not login a non-existing user', async () => {
      const res = await request(app).post('/api/auth/login').send(testData.jonSignup);
      expect(res.status).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });
    it('POST/ should not login a user with incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send(testData.branLoginInc);
      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
  });
};
export default loginTests;
