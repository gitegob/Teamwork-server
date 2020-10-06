/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import testData from '../_testData_/testData';

const loginTests = () => {
  describe('User tests', () => {
    before(async () => {
      await request(app).post('/api/auth/signup').send(testData.branSignup);
    });
    after(async () => {
      await db.sync({ force: true });
      // await db.close();
    });
    it('POST/ should login a user', async () => {
      const res = await request(app).post('/api/auth/login').send(testData.branLogin);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('token');
    });
    it('POST/ should not login a non-existing user', async () => {
      const res = await request(app).post('/api/auth/login').send(testData.jonSignup);
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
    });
    it('POST/ should not login a user with incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send(testData.branLoginInc);
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('error');
    });
  });
};
export default loginTests;
