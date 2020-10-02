import jwt from 'jsonwebtoken';
import { dbModel } from '../config/db';
import log from '../config/debug';
import { joiVal } from '../models/JoiSchema';
import User from '../models/User';
import * as helpers from './helpers';

export const validateSignup = (req, res, next) => joiVal(res, 'signupSchema', req.body) && next();

export const validateArticle = async (req, res, next) => joiVal(res, 'articleSchema', req.body) && next();

export const validateFlag = (req, res, next) => joiVal(res, 'flagSchema', req.body) && next();

export const validateComment = (req, res, next) => joiVal(res, 'commentSchema', req.body) && next();

export const validateParams = (req, res, next) => {
  const articleIDValid = helpers.paramsVal(req.params.articleID);
  const commentIDValid = helpers.paramsVal(req.params.commentID);
  if (!articleIDValid || !commentIDValid) helpers.sendError(res, 400, 'Invalid parameters');
  else next();
};

export const auth = async (req, res, next) => {
  if (!req.headers.authorization) return helpers.sendError(res, 401, 'Please log in or sign up first');
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) return helpers.sendError(res, 401, 'Incorrect Username or Password');
    const user = await dbModel.findOne(res, User, { email: decoded.email });
    if (!user) return helpers.sendError(res, 401, 'Incorrect Username or Password');
    log.helpers(decoded);
    req.payload = decoded;
  } catch (error) {
    return helpers.sendError(res, 401, 'Authentication failed');
  }
  return next();
};
