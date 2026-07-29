import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ১. মডাল থেকে ম্যানুয়াল ট্রানজেকশন সেভ করা (মেইন ফিক্স)
export const createTransaction = async (req: any, res: any) => {
  try {
    const { title, amount, type, category, userId, date } = req.body;
    const newTx = new Transaction({
      userId,
      title,
      amount: Math.abs(Number(amount)), // নিশ্চিত করা হচ্ছে এটি নাম্বার
      type,
      category,
      date: date || new Date()
    });
    await newTx.save();
    res.status(201).json({ success: true, data: newTx });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// ২. ড্যাশবোর্ডের জন্য সব ডাটা এবং বাজেট আনা
export const getTransactions = async (req: any, res: any) => {
  try {
    const { userId } = req.query;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    const user = await User.findById(userId);
    res.json({ success: true, data: transactions, monthlyBudget: user?.monthlyBudget || 0 });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
};

// ৩. এআই প্রসেসিং ফাংশন
export const processAITransaction = async (req: any, res: any) => {
    try {
      const { text, userId } = req.body;
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analyze financial input: "${text}". Return ONLY JSON: {"title": "str", "amount": num, "type": "income"|"expense", "category": "str", "suggestion": "str"}`;
      const result = await model.generateContent(prompt);
      const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  
      if (parsed) {
        const newTx = new Transaction({ userId, ...parsed, amount: Math.abs(parsed.amount), date: new Date() });
        await newTx.save();
        res.status(201).json({ success: true, data: newTx, suggestion: parsed.suggestion });
      } else { throw new Error("Parse Fail"); }
    } catch (e: any) {
      // AI ফেইল করলে ম্যানুয়াল ফেইলসেফ
      const isInc = /earned|salary|received/i.test(req.body.text);
      const amount = req.body.text.match(/\d+/) ? Number(req.body.text.match(/\d+/)[0]) : 0;
      const fallbackTx = new Transaction({ userId: req.body.userId, title: "AI Entry", amount, type: isInc ? 'income' : 'expense', category: 'General', date: new Date() });
      await fallbackTx.save();
      res.status(201).json({ success: true, data: fallbackTx, suggestion: "Logged manually." });
    }
};

// ৪. ডিলিট ফাংশন
export const deleteTransaction = async (req: any, res: any) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
};

// বাকী ২টা স্টাব (এরর এড়াতে)
export const getTransactionById = async (req: any, res: any) => res.json({ success: true });
export const updateTransaction = async (req: any, res: any) => res.json({ success: true });