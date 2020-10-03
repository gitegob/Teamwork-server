/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import utils from '../../lib/test/utils';

describe('Admin tests', () => {
  beforeAll(async (done) => {
    const res = await request(app).post('/api/auth/signup').send(utils.branSignup);
    utils.branToken = res.body.data.token;
    done();
  });
  afterAll(async () => {
    await db.sync({ force: true });
    await db.close();
  });
  it('PATCH/ should make an admin', async (done) => {
    const res = await request(app).patch('/api/auth/users/toggleadmin')
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.makeBranAdmin);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.isAdmin).toEqual(true);
    done();
  });
  it('POST/ should not make an admin with wrong key', async (done) => {
    const res = await request(app).patch('/api/auth/users/toggleadmin')
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.makeBranAdminInv);
    expect(res.status).toEqual(403);
    expect(res.body).toHaveProperty('error');
    done();
  });
  it('POST/ should login an admin', async (done) => {
    const res = await request(app).post('/api/auth/login').send(utils.branLogin);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
    done();
  });
});
