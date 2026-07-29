import { Router } from 'express';
import {getUserProfile,updateBudget, login, register, googleAuth, demoLogin } from '../controllers/user.controller.js';
import {aiFinanceChat} from "../controllers/chat.controller.js";

const router = Router();
router.get('/profile/:id', getUserProfile); 
router.post('/update-budget', updateBudget);
router.post('/register', register);
router.post('/login', login);
router.post('/google-auth', googleAuth);
router.post('/demo-login', demoLogin);
router.post('/chat', aiFinanceChat);

export default router;