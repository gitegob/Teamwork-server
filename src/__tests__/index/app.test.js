/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
// import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
// import db from '../config/db';

// const appTests = () => {
describe('App tests', () => {
  it('GET/ should send a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('data');
  });
  it('GET/ should send a not found message', async () => {
    const res = await request(app).get('/jibberjabber');
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });
});
// };
// export default appTests;
