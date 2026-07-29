import { GoogleGenerativeAI } from '@google/generative-ai';
import Transaction from '../models/transaction.model.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const aiFinanceChat = async (req: any, res: any) => {
  try {
    const { message, userId } = req.body;
    if (!message || !userId) return res.status(400).json({ message: "Missing data" });

    // ১. ডাটাবেস থেকে রিয়েল ডাটা ক্যালকুলেট করা
    const transactions = await Transaction.find({ userId });
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savings = income - expense;
    const lowerMsg = message.toLowerCase();

    try {
      // ২. এআই কল করার চেষ্টা (Gemini)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a financial assistant. User data: Total Income $${income}, Total Expense $${expense}, Savings $${savings}. 
      Question: "${message}". Give a specific, helpful, and short answer.`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      return res.json({ success: true, reply: response });

    } catch (aiError) {
      // ৩. স্মার্ট ফেইল-সেফ (যদি এআই কানেক্ট না হয়, তবে এটি প্রশ্ন বুঝে উত্তর দিবে)
      console.log("AI API Failed, using Smart Fallback...");

      if (lowerMsg.includes("salary") || lowerMsg.includes("income")) {
        return res.json({ success: true, reply: `Your total income/salary recorded this month is $${income.toLocaleString()}. You have ${transactions.filter(t => t.type === 'income').length} income entries.` });
      }

      if (lowerMsg.includes("spend") || lowerMsg.includes("expense") || lowerMsg.includes("cost")) {
        return res.json({ success: true, reply: `You have spent a total of $${expense.toLocaleString()} so far. Your biggest expense entries are visible in your transaction history.` });
      }

      if (lowerMsg.includes("status") || lowerMsg.includes("update") || lowerMsg.includes("balance") || lowerMsg.includes("savings")) {
        return res.json({ success: true, reply: `Status Update: You have $${savings.toLocaleString()} left from your $${income.toLocaleString()} income. Your spending is at ${((expense/(income||1))*100).toFixed(1)}% of your earnings.` });
      }

      // ডিফল্ট উত্তর যদি কোনো কী-ওয়ার্ড না মেলে
      return res.json({ success: true, reply: `I can see your records. Total Income: $${income}, Total Expenses: $${expense}, Net Savings: $${savings}. What specifically would you like to know about these?` });
    }

  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};