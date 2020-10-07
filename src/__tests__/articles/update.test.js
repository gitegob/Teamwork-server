/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import { testLog } from '../../config/debug';
import testData from '../_testData_/testData';

const updateArticleTests = () => {
  describe('Update article tests', () => {
    afterAll(async () => {
      await db.sync({ force: true });
      // await db.close();
      // done();
    });

    beforeAll(async (done) => {
      await request(app).post('/api/auth/signup').send(testData.branSignup);
      await request(app).post('/api/auth/signup').send(testData.jonSignup);
      const res = await request(app).post('/api/auth/login').send(testData.branLogin);
      const res2 = await request(app).post('/api/auth/login').send(testData.jonLogin);
      testData.branToken = res.body.data.token;
      testData.jonToken = res2.body.data.token;
      const res3 = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.branToken}`).send(testData.articleBody);
      testLog.aUpdate(res3.body);
      testData.branArticleId = res3.body.data.id;
      const res4 = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.jonToken}`).send(testData.article2Body);
      testData.jonArticleId = res4.body.data.id;
      done();
    });
    it('PATCH/ user should update their article', async (done) => {
      const res = await request(app)
        .patch(`/api/articles/${testData.branArticleId}`)
        .set('Authorization', `Bearer ${testData.branToken}`)
        .send(testData.articleBodyUpdate);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('data');
      done();
    });
    it('PATCH/ user should not update a article with invalid id', async (done) => {
      const res = await request(app).patch('/api/articles/brian').set('Authorization', `Bearer ${testData.branToken}`).send(testData.articleBodyUpdate);
      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      done();
    });
    it("PATCH/ user should not update another's article", async (done) => {
      const res = await request(app)
        .patch(`/api/articles/${testData.jonArticleId}`)
        .set('Authorization', `Bearer ${testData.branToken}`)
        .send(testData.articleBodyUpdate);
      expect(res.status).toEqual(403);
      expect(res.body).toHaveProperty('error');
      done();
    });
  });
};
export default updateArticleTests;
