import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { dbModel } from '../config/db';
import User from '../models/User';
import schema from './joiValidation';
import log from '../config/debug';

export const sendSuccess = (res, status, message, data) => res.status(status).send({
  status,
  message,
  data: data || null,
});

export const sendError = (res, status, error) => res.status(status).send({
  status,
  error,
});

export const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const checkPassword = (password, hashed) => bcrypt.compareSync(password, hashed);

export const getToken = ({
  id, email, firstName, lastName, isAdmin,
}) => {
  const token = jwt.sign(
    {
      id,
      email,
      firstName,
      lastName,
      isAdmin,
    },
    process.env.JWT_KEY,
  );
  return token;
};

export const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) return sendError(res, 401, 'Please log in or sign up first');
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    log.helper(decoded);
    req.payload = decoded;
  } catch (error) {
    return sendError(res, 401, 'Authentication failed');
  }
  const user = await dbModel.findOne(res, User, { email: req.payload.email });
  if (!user) return sendError(res, 401, 'Invalid token');
  return next();
};

export const joiVal = (res, objSchema, obj) => {
  const { error } = schema[`${objSchema}`].validate({ ...obj });
  if (error) return sendError(res, 400, error.details[0].message.replace(/[/"]/g, ''));
  return error;
};
