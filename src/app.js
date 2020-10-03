import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import articleRoutes from './routes/article.routes';
import userRoutes from './routes/user.routes';
import * as helper from './lib/helpers';
import db, { testDB } from './config/db';

const app = express();
// Test Db
testDB(app);
db.sync({ force: true }).then(() => db.close());
// MIDDLEWARE
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(morgan('dev'));

// ROUTING
app.get('/', (_req, res) => {
  helper.sendSuccess(res, 200, 'Welcome to TeamWork!, go to  https://documenter.getpostman.com/view/8741834/SVtPXARF?version=latest  or go to the REPO at https://github.com/gitego-brian/TeamWork for documentation');
});

app.use('/api/auth', userRoutes);
app.use('/api/articles', articleRoutes);

// Error handling
app.use('/*', (_req, res) => {
  res.status(404).send({ status: 404, error: 'Not Found' });
});

app.use((error, _req, res) => {
  if (error.status === 400) {
    helper.sendError(res, error.status, { message: 'Syntax error, Please double check your input' });
  } else {
    helper.sendError(res, error.status || 500, { message: 'Oops, Server down' });
  }
});

export default app;
