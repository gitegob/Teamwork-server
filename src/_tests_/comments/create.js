/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import { testLog } from '../../config/debug';
import testData from '../_testData_/testData';

const createCommentTests = () => {
  describe('Create Commment tests', () => {
    before(async () => {
      const res = await request(app).post('/api/auth/signup').send(testData.branSignup);
      testData.branToken = res.body.data.token;
      const res2 = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.branToken}`).send(testData.articleBody);
      testData.branArticleId = res2.body.data.id;
      testLog.cCreate(res2.body);
    });
    after(async () => {
      await db.sync({ force: true });
      // await db.close();
    });
    it('POST/ user should comment on an article', async () => {
      const res = await request(app)
        .post(`/api/articles/${testData.branArticleId}/comments`)
        .set('Authorization', `Bearer ${testData.branToken}`)
        .send(testData.commentBody);
      testLog.cCreate(res.body);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message');
    });
    it('POST/ user should not comment on a non-existing article', async () => {
      const res = await request(app).post('/api/articles/0/comments').set('Authorization', `Bearer ${testData.branToken}`).send(testData.commentBody);
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error');
    });
    it('POST/ user should not comment on an article with empty comment', async () => {
      const res = await request(app)
        .post(`/api/articles/${testData.branArticleId}/comments`)
        .set('Authorization', `Bearer ${testData.branToken}`)
        .send({});
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error');
    });
  });
};
export default createCommentTests;
