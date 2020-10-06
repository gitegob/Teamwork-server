/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
// import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import testData from '../_testData_/testData';

// const updateArticleTests = () => {
describe('Update article tests', () => {
  beforeAll(async () => {
    await request(app).post('/api/auth/signup').send(testData.branSignup);
    await request(app).post('/api/auth/signup').send(testData.jonSignup);
    const res = await request(app).post('/api/auth/login').send(testData.branLogin);
    const res2 = await request(app).post('/api/auth/login').send(testData.jonLogin);
    testData.branToken = res.body.data.token;
    testData.jonToken = res2.body.data.token;
    const res3 = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.branToken}`).send(testData.articleBody);
    testData.branArticleId = res3.body.data.id;
    const res4 = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.jonToken}`).send(testData.article2Body);
    testData.jonArticleId = res4.body.data.id;
  });
  afterAll(async () => {
    await db.sync({ force: true });
    await db.close();
  });
  it('PATCH/ user should update their article', async () => {
    const res = await request(app)
      .patch(`/api/articles/${testData.branArticleId}`)
      .set('Authorization', `Bearer ${testData.branToken}`)
      .send(testData.articleBodyUpdate);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('data');
  });
  it('PATCH/ user should not update a article with invalid id', async () => {
    const res = await request(app).patch('/api/articles/brian').set('Authorization', `Bearer ${testData.branToken}`).send(testData.articleBodyUpdate);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
  it("PATCH/ user should not update another's article", async () => {
    const res = await request(app)
      .patch(`/api/articles/${testData.jonArticleId}`)
      .set('Authorization', `Bearer ${testData.branToken}`)
      .send(testData.articleBodyUpdate);
    expect(res.status).toEqual(403);
    expect(res.body).toHaveProperty('error');
  });
});
// };
// export default updateArticleTests;
