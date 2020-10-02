/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import { testLog } from '../../config/debug';
import utils from '../../helpers/test/utils';

describe('Create article tests', () => {
  beforeAll(async (done) => {
    await request(app).post('/api/auth/signup').send(utils.branSignup);
    const res = await request(app).post('/api/auth/login').send(utils.branLogin);
    utils.branToken = res.body.data.token;
    done();
  });
  afterAll(async () => {
    await db.sync({ force: true });
    await db.close();
  });
  it('POST/ user should create an article', async (done) => {
    const res = await request(app).post('/api/articles')
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send(utils.articleBody);
    testLog.aCreate(res.body);
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('article');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('authorId');
    utils.articleId = res.body.data.id;
    done();
  });
  it('POST/ user should not create a article when not logged in', async (done) => {
    const res = await request(app).post('/api/articles')
      .send(utils.articleBody);
    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty('error');
    done();
  });
  it('POST/ user should not create an empty article', async (done) => {
    const res = await request(app).post('/api/articles')
      .set('Authorization', `Bearer ${utils.branToken}`)
      .send({});
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('error');
    done();
  });
});
