import { Router } from 'express';
import { getUserProfile, googleAuth } from '../controllers/user.controller.js';

const router = Router();

// Retrieve user profile by id
router.get('/profile/:id', getUserProfile);

// Handle user Google OAuth flow
router.post('/google-auth', googleAuth);

export default router;
