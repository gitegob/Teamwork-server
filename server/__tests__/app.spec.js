/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../app';
import db from '../config/db';

describe('App tests', () => {
  afterAll(async () => {
    await db.close();
  });
  it('GET/ should send a welcome message', async (done) => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('data');
    done();
  });
  it('GET/ should send a not found message', async (done) => {
    const res = await request(app).get('/jibberjabber');
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('error');
    done();
  });
});
