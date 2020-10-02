import { config } from 'dotenv';

config();

const utils = {
  branSignup: {
    firstName: 'Bran',
    lastName: 'Stark',
    email: 'bstark@gmail.com',
    password: 'Password@123',
    gender: 'male',
    jobRole: 'Software engineer',
    department: 'engineering',
    address: 'Houston',
  },
  branLogin: {
    email: 'bstark@gmail.com',
    password: 'Password@123',
  },
  branLoginInc: {
    email: 'bstark@gmail.com',
    password: 'Password@Incorrect',
  },
  jonSignup: {
    firstName: 'Jon',
    lastName: 'Snow',
    email: 'jsnow@gmail.com',
    password: 'Password@123',
    gender: 'male',
    jobRole: 'Software engineer',
    department: 'engineering',
    address: 'Houston',
  },
  jonLogin: {
    email: 'jsnow@gmail.com',
    password: 'Password@123',
  },
  articleBody: {
    title: 'Just a sign',
    article:
      'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?',
  },
  article2Body: {
    title: 'Just another sign',
    article:
      'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?',
  },
  articleBodyUpdate: {
    title: 'Just a sign updated',
    article:
      'Looking at the world through my rearview, searching for an answer up high, or is it all wasted time?',
  },
  invalidToken: 'eyhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiQmVuIiwibGFzdE5hbWUiOiJHaXNhIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU3Mjg4MzQ4MX0.WviyBGlvr1y0KNfcxwDwjtw8JwmJ8GCe6N5wk-OPSgk',
  nonExistToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiQmVuIiwibGFzdE5hbWUiOiJHaXNhIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU3Mjk1NjY3NH0.8Rt05JoON0ayCTtetWWelYh4q9sz-NLLZJOUEqJ79Ig',
};
export default utils;
