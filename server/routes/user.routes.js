import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as validate from '../helpers/validation';
import * as helper from '../helpers/helper';

const router = Router();

router.post('/signup', validate.validateSignup, userController.signUp);
router.post('/login', userController.signIn);
router.patch('/users/toggleadmin', helper.verifyToken, userController.toggleAdmin);

export default router;
