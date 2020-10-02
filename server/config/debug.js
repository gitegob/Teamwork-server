import debug from 'debug';

const log = {
  app: debug('app:app'),
  db: debug('app:db'),
  userCont: debug('app:user.controller'),
  articleCont: debug('app:article.controller'),
  error: debug('app:error'),
  helper: debug('app:helpers.helper'),
};
export const testLog = {
  signup: debug('app:test:u.signup'),
  login: debug('app:test:u.login'),
  aGet: debug('app:test:a.get'),
  aCreate: debug('app:test:a.create'),
  aUpdate: debug('app:test:a.update'),
  aDelete: debug('app:test:a.delete'),
};
export default log;
