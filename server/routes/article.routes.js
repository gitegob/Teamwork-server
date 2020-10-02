import { Router } from 'express';
import * as helper from '../helpers/helper';
import * as articleController from '../controllers/articleController';
import * as validate from '../helpers/validation';

const router = Router();

router.get('/', helper.verifyToken, articleController.getArticles);
router.post('/', helper.verifyToken, validate.validateArticle, articleController.createArticle);
router.get('/:articleID', validate.validateParams, helper.verifyToken, articleController.getSingleArticle);
router.patch('/:articleID', validate.validateParams, helper.verifyToken, articleController.updateArticle);
router.delete('/:articleID', validate.validateParams, helper.verifyToken, articleController.deleteArticle);
router.post('/:articleID/flags', validate.validateParams, helper.verifyToken, validate.validateFlag, articleController.flagArticle);
router.post('/:articleID/comments', validate.validateParams, helper.verifyToken, validate.validateComment, articleController.createComment);
router.post('/:articleID/comments/:commentID/', validate.validateParams, helper.verifyToken, validate.validateFlag, articleController.flagComment);
router.delete('/:articleID/comments/:commentID/', validate.validateParams, helper.verifyToken, articleController.deleteComment);

export default router;
