import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const sendSuccess = (res, status, message, data) => res.status(status).json({
  status,
  message,
  data: data || null,
});

export const sendError = (res, status, error) => res.status(status).json({
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

export const paramsVal = (param) => {
  const validParam = !param || !Number.isNaN(Number(param));
  let paramValid = false;
  if (validParam) {
    if (Number(param) > 1000000) paramValid = false;
    else paramValid = true;
  } else paramValid = false;

  return paramValid;
};
