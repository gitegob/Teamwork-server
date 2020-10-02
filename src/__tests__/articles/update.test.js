/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import utils from '../../lib/test/utils';

describe('Update article tests', () => {
  beforeAll(async (done) => {
    await request(app).post('/api/auth/signup').send(utils.branSignup);
    await request(app).post('/api/auth/signup').send(utils.jonSignup);
    const res = await request(app).post('/api/auth/login').send(utils.branLogin);
    const res2 = await request(app).post('/api/auth/login').send(utils.jonLogin);
    utils.branToken = res.body.data.token;
    utils.jonToken = res2.body.data.token;
    const res3 = await request(app).post('/api/articles')
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.articleBody);
    utils.branArticleId = res3.body.data.id;
    const res4 = await request(app).post('/api/articles')
      .set('Authorization', `Bearer ${utils.jonToken}`)
      .send(utils.article2Body);
    utils.jonArticleId = res4.body.data.id;
    done();
  });
  afterAll(async () => {
    await db.sync({ force: true });
    await db.close();
  });
  it('PATCH/ user should update their article', async (done) => {
    const res = await request(app).patch(`/api/articles/${utils.branArticleId}`)
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.articleBodyUpdate);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('data');
    done();
  });
  it('PATCH/ user should not update a article with invalid id', async (done) => {
    const res = await request(app).patch('/api/articles/brian')
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.articleBodyUpdate);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('error');
    done();
  });
  it('PATCH/ user should not update another\'s article', async (done) => {
    const res = await request(app).patch(`/api/articles/${utils.jonArticleId}`)
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.articleBodyUpdate);
    expect(res.status).toEqual(403);
    expect(res.body).toHaveProperty('error');
    done();
  });
});
