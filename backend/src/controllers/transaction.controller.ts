import { GoogleGenerativeAI } from '@google/generative-ai';
import Transaction from '../models/transaction.model.js';
import mongoose from 'mongoose';

export const processAITransaction = async (req: any, res: any) => {
  const { text, userId } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "Text is required" });

  let finalData: any = null;

  try {
    // --- STEP 1: AI কল করার চেষ্টা করা ---
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    const prompt = `Return ONLY JSON: {"title": "item", "amount": 10, "type": "expense", "category": "food"}. Input: ${text}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) finalData = JSON.parse(jsonMatch[0]);

  } catch (error: any) {
    console.error("AI API Error (Fallback Triggered):", error.message);
    
    // --- STEP 2: ফেইল-সেফ (যদি এপিআই কাজ না করে) ---
    // ইউজারের টেক্সট থেকে ম্যানুয়ালি অ্যামাউন্ট বের করা (যেমন: 'spent 500' থেকে ৫০০ বের করবে)
    const amountMatch = text.match(/\d+/);
    finalData = {
      title: text.length > 30 ? text.substring(0, 30) + "..." : text,
      amount: amountMatch ? Number(amountMatch[0]) : 0,
      type: text.toLowerCase().includes('salary') || text.toLowerCase().includes('received') ? 'income' : 'expense',
      category: "AI Categorized",
    };
  }

  try {
    // --- STEP 3: ডাটাবেসে সেভ করা ---
    const validUserId = mongoose.Types.ObjectId.isValid(userId) 
      ? userId 
      : new mongoose.Types.ObjectId('669b9b9b9b9b9b9b9b9b9b9b');

    const newTransaction = new Transaction({
      userId: validUserId,
      ...finalData,
      date: new Date()
    });

    await newTransaction.save();
    return res.status(201).json({ success: true, data: newTransaction });

  } catch (dbError: any) {
    return res.status(500).json({ success: false, message: "Database Error", error: dbError.message });
  }
};

// ... বাকি গেট/ডিলিট ফাংশনগুলো আগের মতোই রাখুন

// বাকি গেট/ডিলিট ফাংশনগুলো নিচে থাকবে...

// ২. সব ট্রানজেকশন পাওয়ার ফাংশন
export const getTransactions = async (req: any, res: any) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    return res.status(200).json({ success: true, data: transactions });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ৩. বাকি সব প্রয়োজনীয় ফাংশন (যাতে রাউট ফাইল এরর না দেয়)
export const createTransaction = async (req: any, res: any) => {
  try {
    const newTx = new Transaction(req.body);
    await newTx.save();
    return res.status(201).json({ success: true, data: newTx });
  } catch (error: any) { return res.status(400).json({ success: false, message: error.message }); }
};

export const getTransactionById = async (req: any, res: any) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    return res.status(200).json({ success: true, data: tx });
  } catch (error: any) { return res.status(404).json({ success: false, message: "Not found" }); }
};

export const updateTransaction = async (req: any, res: any) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) { return res.status(400).json({ success: false, message: error.message }); }
};

export const deleteTransaction = async (req: any, res: any) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Deleted" });
  } catch (error: any) { return res.status(500).json({ success: false, message: error.message }); }
};