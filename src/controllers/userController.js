/* eslint-disable consistent-return */
import * as helper from '../lib/helpers';
import User from '../models/User';
import Password from '../models/Password';
import { dbModel } from '../config/db';

export const signUp = async (req, res) => {
  const user = await dbModel.findOne(res, User, { email: req.body.email });
  if (user) return helper.sendError(res, 409, 'Email already exists');
  const newUser = await dbModel.create(res, User, { ...req.body, password: null });
  if (newUser) {
    await dbModel.create(res, Password, {
      userId: newUser.dataValues.id,
      password: req.body.password,
    });
    return helper.sendSuccess(res, 201, 'User Account successfully created', {
      token: helper.getToken(newUser.dataValues),
    });
  }
};

export const signIn = async (req, res) => {
  const user = await dbModel.findOne(res, User, { email: req.body.email });
  if (!user) return helper.sendError(res, 404, 'User doesn\'t exist');
  const password = await dbModel.findOne(res, Password, { userId: user.id });
  const checked = helper.checkPassword(req.body.password, password.dataValues.password);
  if (!checked) return helper.sendError(res, 401, 'Username or password incorrect');
  const token = helper.getToken(user.dataValues);
  if (user.dataValues.isAdmin) return helper.sendSuccess(res, 200, 'Admin is successfully logged in', { token });
  return helper.sendSuccess(res, 200, 'User is successfully logged in', { token });
};

export const toggleAdmin = async (req, res) => {
  const user = await dbModel.findOne(res, User, { email: req.body.email });
  if (!user) return helper.sendError(res, 404, 'User doesn\'t exist');
  if (req.body.key === process.env.ADMIN_KEY) {
    const updatedUser = await dbModel.update(res, user, { isAdmin: req.body.isAdmin });
    if (updatedUser) return helper.sendSuccess(res, 200, 'Admin updated', updatedUser);
  }
  return helper.sendError(res, 403, 'Admin update failed');
};
