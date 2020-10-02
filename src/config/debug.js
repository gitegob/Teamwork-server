import debug from 'debug';

const log = {
  app: debug('app:app'),
  db: debug('app:db'),
  userCont: debug('app:user.controller'),
  articleCont: debug('app:article.controller'),
  error: debug('app:error'),
  helpers: debug('app:helpers.helper'),
};
export const testLog = {
  res: debug('app:test:response'),
  signup: debug('app:test:u.signup'),
  login: debug('app:test:u.login'),
  aGet: debug('app:test:a.get'),
  aCreate: debug('app:test:a.create'),
  aUpdate: debug('app:test:a.update'),
  aDelete: debug('app:test:a.delete'),
  cCreate: debug('app:test:c.create'),
  cDelete: debug('app:test:c.delete'),
  cUpdate: debug('app:test:c.update'),
};
export default log;
