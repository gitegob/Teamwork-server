/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import testData from '../_testData_/testData';

const adminTests = () => {
  describe('Admin tests', () => {
    before(async () => {
      const res = await request(app).post('/api/auth/signup').send(testData.branSignup);
      testData.branToken = res.body.data.token;
    });
    after(async () => {
      await db.sync({ force: true });
      // await db.close();
    });
    it('PATCH/ should make an admin', async () => {
      const res = await request(app)
        .patch('/api/auth/users/toggleadmin')
        .set('Authorization', `Bearer ${testData.branToken}`)
        .send(testData.makeBranAdmin);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
      expect(res.body.data.isAdmin).to.equal(true);
    });
    it('POST/ should not make an admin with wrong key', async () => {
      const res = await request(app)
        .patch('/api/auth/users/toggleadmin')
        .set('Authorization', `Bearer ${testData.branToken}`)
        .send(testData.makeBranAdminInv);
      expect(res.status).to.equal(403);
      expect(res.body).to.have.property('error');
    });
    it('POST/ should login an admin', async () => {
      const res = await request(app).post('/api/auth/login').send(testData.branLogin);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
    });
  });
};

export default adminTests;
