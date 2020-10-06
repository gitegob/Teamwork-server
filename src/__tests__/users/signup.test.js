/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
// import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import { testLog } from '../../config/debug';
import testData from '../_testData_/testData';

// const signupTests = () => {
describe('User tests', () => {
  console.log(process.env.NODE_ENV);
  afterAll(async (done) => {
    await db.sync({ force: true });
    await db.close();
    done();
  });
  it('POST/ should signup a user', async (done) => {
    const res = await request(app).post('/api/auth/signup').send(testData.branSignup);
    testLog.signup(res.body);
    expect(res.status).toEqual(201);
    done();
  });
  it('POST/ should not signup an already existing user', async (done) => {
    const res = await request(app).post('/api/auth/signup').send(testData.branSignup);
    testLog.signup(res.body);
    expect(res.status).toEqual(409);
    expect(res.body).toHaveProperty('error');
    done();
  });
});
// };
// export default signupTests;
