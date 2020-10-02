/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import { testLog } from '../../config/debug';
import utils from '../../helpers/test/utils';

describe('User tests', () => {
  beforeAll(async (done) => {
    await request(app).post('/api/auth/signup').send(utils.branSignup);
    done();
  });
  afterAll(async () => {
    await db.sync({ force: true });
    await db.close();
  });
  it('POST/ should login a user', async (done) => {
    const res = await request(app).post('/api/auth/login').send(utils.branLogin);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('token');
    done();
  });
  it('POST/ should not login a non-existing user', async (done) => {
    const res = await request(app).post('/api/auth/login').send(utils.jonSignup);
    testLog.login(res.body);
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('error');
    done();
  });
  it('POST/ should not login a user with incorrect password', async (done) => {
    const res = await request(app).post('/api/auth/login').send(utils.branLoginInc);
    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty('error');
    done();
  });
});
