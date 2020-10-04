/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import { testLog } from '../../config/debug';
import testData from '../_testData_/testData';

const tempData = {};
describe('Delete article tests', () => {
  beforeAll(async () => {
    await request(app).post('/api/auth/signup').send(testData.branSignup);
    const res = await request(app).post('/api/auth/signup').send(testData.jonSignup);
    tempData.jonToken = res.body.data.token;
    await request(app).patch('/api/auth/users/toggleadmin').set('Authorization', `Bearer ${testData.jonToken}`).send(testData.makeBranAdmin);
    const res2 = await request(app).post('/api/auth/login').send(testData.branLogin);
    tempData.branToken = res2.body.data.token;
    console.log('***************************testttt', res, res2);
    const res3 = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.branToken}`).send(testData.articleBody);
    tempData.branArticleId = res3.body.data.id;
    const res4 = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.jonToken}`).send(testData.article2Body);
    tempData.jonArticleId = res4.body.data.id;
  });
  afterAll(async (done) => {
    await db.sync({ force: true });
    await db.close();
    done();
  });
  it("DELETE/ user should not delete another's article", async (done) => {
    const res = await request(app).delete(`/api/articles/${tempData.jonArticleId}`).set('Authorization', `Bearer ${testData.branToken}`);
    testLog.aDelete(res.body);
    expect(res.status).toEqual(403);
    expect(res.body).toHaveProperty('error');
    done();
  });
  it('POST/ user should flag an article', async (done) => {
    const res = await request(app)
      .post(`/api/articles/${tempData.jonArticleId}/flags`)
      .set('Authorization', `Bearer ${tempData.branToken}`)
      .send(testData.flagBody);
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('message');
    done();
  });
  it('DELETE/ admin should delete a flagged article', async (done) => {
    const res = await request(app).delete(`/api/articles/${tempData.jonArticleId}`).set('Authorization', `Bearer ${tempData.branToken}`);
    testLog.aDelete(res.body);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('message');
    done();
  });
  it('DELETE/ user should delete their article', async (done) => {
    const res = await request(app).delete(`/api/articles/${tempData.branArticleId}`).set('Authorization', `Bearer ${tempData.branToken}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('message');
    done();
  });
  it('DELETE/ user should not delete a article with invalid id', async (done) => {
    const res = await request(app).delete('/api/articles/brian').set('Authorization', `Bearer ${tempData.branToken}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('error');
    done();
  });
});
