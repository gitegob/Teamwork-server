/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import testData from '../_testData_/testData';

// const getArticleTests = () => {
describe('Get article tests', () => {
  before(async () => {
    await request(app).post('/api/auth/signup').send(testData.branSignup);
    const res = await request(app).post('/api/auth/login').send(testData.branLogin);
    testData.branToken = res.body.data.token;
    const res2 = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.branToken}`).send(testData.articleBody);
    testData.branArticleId = res2.body.data.id;
  });
  after(async () => {
    await db.sync({ force: true });
    // await db.close();
  });
  it('GET/ user should get all articles', async () => {
    const res = await request(app).get('/api/articles').set('Authorization', `Bearer ${testData.branToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('count');
    expect(res.body.data).to.have.property('articles');
  });
  it('GET/ user should get an article', async () => {
    const res = await request(app).get(`/api/articles/${testData.branArticleId}`).set('Authorization', `Bearer ${testData.branToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('article');
    expect(res.body.data).to.have.property('comments');
  });
  it('GET/ user should not get a non-existing article', async () => {
    const res = await request(app).get('/api/articles/0').set('Authorization', `Bearer ${testData.branToken}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });
  it('GET/ user should not get a article with invalid id', async () => {
    const res = await request(app).get('/api/articles/brian').set('Authorization', `Bearer ${testData.branToken}`);
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
});
// };
// export default getArticleTests;
