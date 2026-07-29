import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ১. গুগল অথেনটিকেশন
export const googleAuth = async (req: any, res: any) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token");

    const { email, name, sub: googleId, picture } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, googleId, picture });
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ২. বাজেট আপডেট (মাসিক বাজেটের জন্য)
export const updateBudget = async (req: any, res: any) => {
  try {
    const { userId, amount } = req.body;
    await User.findByIdAndUpdate(userId, { monthlyBudget: amount });
    res.status(200).json({ success: true, message: "Budget updated" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৩. ম্যানুয়াল রেজিস্ট্রেশন
export const register = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Email already taken" });
  }
};

// ৪. ম্যানুয়াল লগইন
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({ success: true, data: user });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৫. ডেমো লগইন
export const demoLogin = async (req: any, res: any) => {
  try {
    let user = await User.findOne({ email: "demo@wealthwise.ai" });
    if (!user) {
      user = await User.create({ name: "Demo User", email: "demo@wealthwise.ai", googleId: "demo-123" });
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ৬. ইউজার প্রোফাইল ডাটা
export const getUserProfile = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (e: any) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};