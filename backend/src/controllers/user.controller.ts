import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ১. গুগল লগইন
export const googleAuth = async (req: any, res: any) => {
  try {
    const { token } = req.body;

    // Build verify options without undefined audience
    const verifyOptions: { idToken: string; audience?: string } = { idToken: token };
    if (process.env.GOOGLE_CLIENT_ID) {
      verifyOptions.audience = process.env.GOOGLE_CLIENT_ID;
    }

    const ticket = await client.verifyIdToken(verifyOptions);
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token: no payload');
    }

    // Safely extract fields, filtering out undefined
    const { email, name, sub: googleId, picture } = payload;

    // Build query object only with defined email
    const query: { email?: string } = {};
    if (email) query.email = email;

    let user = await User.findOne(query);

    if (!user) {
      // Build creation object only with defined fields
      const newUserData: {
        name?: string;
        email?: string;
        googleId?: string;
        picture?: string;
      } = {};
      if (name) newUserData.name = name;
      if (email) newUserData.email = email;
      if (googleId) newUserData.googleId = googleId;
      if (picture) newUserData.picture = picture;

      user = await User.create(newUserData);
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ২. ম্যানুয়াল রেজিস্ট্রেশন
export const register = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ success: true, data: user });
  } catch (error: any) { res.status(400).json({ success: false, message: "Email already taken" }); }
};

// ৩. ম্যানুয়াল লগইন
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({ success: true, data: user });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

// ৪. ওয়ান-ক্লিক ডেমো
export const demoLogin = async (req: any, res: any) => {
  try {
    let user = await User.findOne({ email: 'demo@wealthwise.ai' });
    if (!user) user = await User.create({ name: 'Demo User', email: 'demo@wealthwise.ai', googleId: 'demo-123' });
    res.json({ success: true, data: user });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

// ৫. প্রোফাইল ডাটা
export const getUserProfile = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, data: user });
  } catch (e: any) { res.status(404).json({ message: "User not found" }); }
};