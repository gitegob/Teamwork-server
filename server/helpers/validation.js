import * as helper from './helper';

export const validateSignup = (req, res, next) => {
  const error = helper.joiVal(res, 'signupSchema', req.body);
  if (!error) return next();
  return null;
};

export const validateArticle = async (req, res, next) => {
  const error = helper.joiVal(res, 'articleSchema', req.body);
  if (!error) return next();
  return null;
};

export const validateFlag = (req, res, next) => {
  const error = helper.joiVal(res, 'flagSchema', req.body);
  if (!error) return next();
  return null;
};

export const validateComment = (req, res, next) => {
  const error = helper.joiVal(res, 'commentSchema', req.body);
  if (!error) return next();
  return null;
};

export const validateParams = (req, res, next) => {
  const validArticleID = Number.isInteger(Number(req.params.articleID));
  const validCommentID = Number.isInteger(Number(req.params.commentID));
  if (req.params.articleID && (!validArticleID
      || (parseInt(req.params.articleID, 10) > 1000000000))) {
    return res.status(400).send({
      status: 400,
      error: 'Invalid parameters',
    });
  }
  if (req.params.commentID && (!validCommentID
      || (parseInt(req.params.commentID, 10) > 1000000000))) {
    return res.status(400).send({
      status: 400,
      error: 'Invalid parameters',
    });
  } return next();
};
