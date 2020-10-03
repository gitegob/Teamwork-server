/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import { testLog } from '../../config/debug';
import utils from '../../lib/test/utils';

describe('Create Commment tests', () => {
  beforeAll(async (done) => {
    const res = await request(app).post('/api/auth/signup').send(utils.branSignup);
    utils.branToken = res.body.data.token;
    const res2 = await request(app).post('/api/articles')
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.articleBody);
    utils.branArticleId = res2.body.data.id;
    testLog.cCreate(res2.body);
    done();
  });
  afterAll(async () => {
    await db.sync({ force: true });
    await db.close();
  });
  it('POST/ user should comment on an article', async (done) => {
    const res = await request(app).post(`/api/articles/${utils.branArticleId}/comments`)
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.commentBody);
    testLog.cCreate(res.body);
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('message');
    done();
  });
  it('POST/ user should not comment on a non-existing article', async (done) => {
    const res = await request(app).post('/api/articles/0/comments').set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.commentBody);
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('error');
    done();
  });
  it('POST/ user should not comment on an article with empty comment', async (done) => {
    const res = await request(app).post(`/api/articles/${utils.branArticleId}/comments`)
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send({});
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('error');
    done();
  });
});
