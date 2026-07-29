import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// ১. মাসিক ট্রানজেকশন এবং বাজেট ফেচ করা
export const fetchTransactions = (userId: string, month: number, year: number) => {
  return api.get(`/transactions?userId=${userId}&month=${month}&year=${year}`);
};

// ২. ট্রানজেকশন ডিলিট করা
export const deleteTransaction = (id: string) => {
  return api.delete(`/transactions/${id}`);
};

// ৩. নতুন ট্রানজেকশন তৈরি করা (মডাল থেকে)
export const createTransactionApi = (data: any) => {
  return api.post('/transactions', data);
};

// ৪. এআই প্রসেসিং (যদি এখনো ব্যবহার করতে চান)
export const processWithAI = (text: string, userId: string) => {
  return api.post('/transactions/ai-process', { text, userId });
};

// ৫. মাসিক বাজেট আপডেট করা
export const updateBudgetApi = (userId: string, amount: number) => {
  return api.post('/users/update-budget', { userId, amount });
};

// ৬. প্রোফাইল দেখা
export const getUserProfile = (id: string) => {
  return api.get(`/users/profile/${id}`);
};

export default api;