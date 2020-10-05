/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import testData from '../_testData_/testData';

const signupTests = () => {
  describe('User tests', () => {
    after(async () => {
      await db.sync({ force: true });
      // await db.close();
    });
    it('POST/ should signup a user', async () => {
      const res = await request(app).post('/api/auth/signup').send(testData.branSignup);
      expect(res.status).to.equal(201);
    });
    it('POST/ should not signup an already existing user', async () => {
      const res = await request(app).post('/api/auth/signup').send(testData.branSignup);
      expect(res.status).to.equal(409);
      expect(res.body).to.have.property('error');
    });
  });
};
export default signupTests;
