import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as middleware from '../lib/middleware';

const router = Router();

router.post('/signup', middleware.validateSignup, userController.signUp);
router.post('/login', userController.signIn);
router.patch('/users/toggleadmin', middleware.auth, userController.toggleAdmin);

export default router;
