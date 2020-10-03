/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import { testLog } from '../../config/debug';
import utils from '../../lib/test/utils';

describe('Delete Comment tests', () => {
  beforeAll(async (done) => {
    await request(app).post('/api/auth/signup').send(utils.branSignup);
    const res = await request(app).post('/api/auth/signup').send(utils.jonSignup);
    utils.jonToken = res.body.data.token;
    await request(app).patch('/api/auth/users/toggleadmin').set('Authorization', `Bearer ${utils.jonToken}`)
      .send(utils.makeBranAdmin);
    const res2 = await request(app).post('/api/auth/login').send(utils.branLogin);
    testLog.aDelete(res2.body);
    utils.branToken = res2.body.data.token;
    const res3 = await request(app).post('/api/articles')
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.articleBody);
    utils.branArticleId = res3.body.data.id;
    const res4 = await request(app).post('/api/articles')
      .set('Authorization', `Bearer ${utils.jonToken}`)
      .send(utils.article2Body);
    utils.jonArticleId = res4.body.data.id;
    const res5 = await request(app).post(`/api/articles/${utils.jonArticleId}/comments`)
      .set('Authorization', `Bearer ${utils.jonToken}`)
      .send(utils.commentBody);
    utils.jonCommentId = res5.body.data.comment.id;
    const res6 = await request(app).post(`/api/articles/${utils.branArticleId}/comments`)
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.commentBody);
    utils.branCommentId = res6.body.data.comment.id;
    done();
  });
  afterAll(async (done) => {
    await db.sync({ force: true });
    await db.close();
    done();
  });
  it('DELETE/ user should not delete another\'s comment', async (done) => {
    const res = await request(app).delete(`/api/articles/${utils.jonArticleId}/comments/${utils.jonCommentId}`)
      .set('Authorization', `Bearer ${utils.branToken}`);
    expect(res.status).toEqual(403);
    expect(res.body).toHaveProperty('error');
    done();
  });
  it('POST/ user should flag a comment', async (done) => {
    const res = await request(app).post(`/api/articles/${utils.jonArticleId}/comments/${utils.jonCommentId}/flags`)
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.flagBody);
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('message');
    done();
  });
  it('DELETE/ admin should delete a flagged comment', async (done) => {
    const res = await request(app).delete(`/api/articles/${utils.jonArticleId}/comments/${utils.jonCommentId}`)
      .set('Authorization', `Bearer ${utils.branToken}`);
    testLog.aDelete(res.body);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('message');
    done();
  });
  it('DELETE/ user should delete their comment', async (done) => {
    const res = await request(app).delete(`/api/articles/${utils.branArticleId}/comments/${utils.branCommentId}`)
      .set('Authorization', `Bearer ${utils.branToken}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('message');
    done();
  });
  it('DELETE/ user should not delete a comment with invalid id', async (done) => {
    const res = await request(app).delete(`/api/articles/${utils.branArticleId}/comments/brian`)
      .set('Authorization', `Bearer ${utils.branToken}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('error');
    done();
  });
});
