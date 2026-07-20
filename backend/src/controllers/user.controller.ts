import type { Request, Response, NextFunction } from 'express';
import User from '../models/user.model.js';

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/profile/:id
 * @access  Public/Protected
 */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate User via Google OAuth credentials
 * @route   POST /api/users/google-auth
 * @access  Public
 */
export const googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, googleId, picture } = req.body;

    if (!email || !googleId || !name) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and googleId' });
      return;
    }

    let user = await User.findOne({ googleId });

    if (user) {
      // Keep profile info updated from OAuth provider
      user.name = name;
      if (picture) user.picture = picture;
      await user.save();
    } else {
      user = new User({
        name,
        email,
        googleId,
        picture,
      });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'User authenticated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
