/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import db from '../../config/db';
import testData from '../_testData_/testData';

describe('Create article tests', () => {
  before(async () => {
    const res = await request(app).post('/api/auth/signup').send(testData.branSignup);
    testData.branToken = res.body.data.token;
  });
  after(async () => {
    await db.sync({ force: true });
    await db.close();
  });
  it('POST/ user should create an article', async () => {
    const res = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.branToken}`).send(testData.articleBody);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('article');
    expect(res.body.data).to.have.property('id');
    expect(res.body.data).to.have.property('authorId');
    testData.articleId = res.body.data.id;
  });
  it('POST/ user should not create a article when not logged in', async () => {
    const res = await request(app).post('/api/articles').send(testData.articleBody);
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('error');
  });
  it('POST/ user should not create an empty article', async () => {
    const res = await request(app).post('/api/articles').set('Authorization', `Bearer ${testData.branToken}`).send({});
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
});
