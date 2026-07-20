import { Router } from 'express';
import { login, register, googleAuth, demoLogin } from '../controllers/user.controller.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/google-auth', googleAuth);
router.post('/demo-login', demoLogin);

export default router;