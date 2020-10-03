import { dbModel } from '../config/db';
import * as helper from '../lib/helpers';
import Article from '../models/Article';
import Comment from '../models/Comment';
import ArticleFlag from '../models/ArticleFlag';
import CommentFlag from '../models/CommentFlag';
import log from '../config/debug';

export const getArticles = async (_req, res) => {
  const articles = await dbModel.findAll(res, Article, { order: [['createdAt', 'DESC']] });
  log.userCont(articles.length);
  return helper.sendSuccess(res, 200, 'All articles', { count: articles.length, articles });
};

export const createArticle = async (req, res) => {
  const { firstName, lastName, id: authorId } = req.payload;
  const authorName = `${firstName} ${lastName}`;
  const { title, article } = req.body;
  const newArticle = await dbModel.create(res, Article, {
    authorId, authorName, title: title.replace(/\s+/g, ' '), article: article.replace(/\s+/g, ' '),
  });
  return helper.sendSuccess(res, 201, 'Article successfully created', newArticle.dataValues);
};

export const getSingleArticle = async (req, res) => {
  const { articleID } = req.params;
  const article = await dbModel.findOne(res, Article, { id: articleID });
  if (!article) return helper.sendError(res, 404, 'Article not found');
  const comments = await dbModel.findAll(res, Comment, { where: { articleId: articleID }, order: [['postedAt', 'DESC']] });
  return helper.sendSuccess(res, 200, 'success', { article: article.dataValues, comments });
};

export const updateArticle = async (req, res) => {
  if (!req.body.title && !req.body.article) return helper.sendError(res, 400, 'Can\'t update if no changes made');
  const article = await dbModel.findOne(res, Article, { id: req.params.articleID });
  if (!article) return helper.sendError(res, 404, 'Article not found');
  if (article.dataValues.authorId !== req.payload.id) return helper.sendError(res, 403, 'Not Authorized');
  const updatedArticle = await dbModel.update(res, article, { ...req.body });
  log.articleCont(updatedArticle);
  if (!updatedArticle) return helper.sendError(res, 400, 'Article not updated');
  return helper.sendSuccess(res, 200, 'Article successfully updated', updatedArticle);
};

export const deleteArticle = async (req, res) => {
  const { id, isAdmin } = req.payload;
  const article = await dbModel.findOne(res, Article, { id: req.params.articleID });
  if (!article) return helper.sendError(res, 404, 'Article not found');
  const flags = await dbModel.findAll(res, ArticleFlag,
    { where: { articleId: req.params.articleID } });
  let canDelete;
  if (id === article.dataValues.authorId) canDelete = true;
  else if (isAdmin) canDelete = !!flags.length;
  else canDelete = false;
  if (!canDelete) return helper.sendError(res, 403, 'Not Authorized');
  await dbModel.delete(res, article);
  return helper.sendSuccess(res, 200, 'Article successfully deleted');
};

export const flagArticle = async (req, res) => {
  const { reason } = req.body;
  const { articleID } = req.params;
  const { id } = req.payload;
  const article = await dbModel.findOne(res, Article, { id: articleID });
  if (!article) return helper.sendError(res, 404, 'Article not found');
  if (article.dataValues.authorId === id) return helper.sendError(res, 400, 'You cannot flag your own article');
  const newFlag = await dbModel.create(res, ArticleFlag,
    { authorId: id, articleId: articleID, reason });
  return helper.sendSuccess(res, 201, 'Article flagged', {
    flag: newFlag.dataValues,
    article: article.dataValues,
  });
};

export const createComment = async (req, res) => {
  const { comment } = req.body;
  const { id: authorId } = req.payload;
  const article = await dbModel.findOne(res, Article, { id: req.params.articleID });
  if (!article) return helper.sendError(res, 404, 'Article not found');
  const newComment = await dbModel.create(res, Comment,
    { authorId, articleId: req.params.articleID, comment });
  return helper.sendSuccess(res, 201, 'Comment posted', {
    comment: newComment.dataValues,
    article: article.dataValues,
  });
};

export const flagComment = async (req, res) => {
  const { reason } = req.body;
  const { articleID, commentID } = req.params;
  const { id } = req.payload;
  const comment = await dbModel.findOne(res, Comment, { id: commentID, articleId: articleID });
  if (!comment) return helper.sendError(res, 404, 'Comment not found');
  if (comment.dataValues.authorId === id) return helper.sendError(res, 400, 'You cannot flag your own comment');
  const newFlag = await dbModel.create(res, CommentFlag,
    { authorId: id, commentId: commentID, reason });
  return helper.sendSuccess(res, 201, 'Comment flagged!', {
    flag: newFlag.dataValues,
    comment: comment.dataValues,
  });
};

export const deleteComment = async (req, res) => {
  const { articleID, commentID } = req.params;
  const { id, isAdmin } = req.payload;
  const comment = await dbModel.findOne(res, Comment, { id: commentID, articleId: articleID });
  if (!comment) return helper.sendError(res, 404, 'Comment not found');
  const flags = await dbModel.findAll(res, CommentFlag, { where: { commentId: commentID } });
  let canDelete;
  if (id === comment.dataValues.authorId) canDelete = true;
  else if (isAdmin) canDelete = !!flags.length;
  else canDelete = false;
  if (!canDelete) return helper.sendError(res, 403, 'Not Authorized');
  await dbModel.delete(res, comment);
  return helper.sendSuccess(res, 200, 'Comment successfully deleted');
};
