import { Router } from 'express';
import * as articleController from '../controllers/articleController';
import * as middleware from '../lib/middleware';

const router = Router();

router.get('/', middleware.auth, articleController.getArticles);
router.post('/', middleware.auth, middleware.validateArticle, articleController.createArticle);
router.get('/:articleID', middleware.validateParams, middleware.auth, articleController.getSingleArticle);
router.patch('/:articleID', middleware.validateParams, middleware.auth, articleController.updateArticle);
router.delete('/:articleID', middleware.validateParams, middleware.auth, articleController.deleteArticle);
router.post('/:articleID/flags', middleware.validateParams, middleware.auth, middleware.validateFlag, articleController.flagArticle);
router.post('/:articleID/comments', middleware.validateParams, middleware.auth, middleware.validateComment, articleController.createComment);
router.post('/:articleID/comments/:commentID/flags', middleware.validateParams, middleware.auth, middleware.validateFlag, articleController.flagComment);
router.delete('/:articleID/comments/:commentID/', middleware.validateParams, middleware.auth, articleController.deleteComment);

export default router;
