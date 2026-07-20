import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// মেইন এআই ফাংশন
export const processWithAI = (text: string, userId: string) => {
  return api.post('/transactions/ai-process', { text, userId });
};

// ডাটা গেট ফাংশন (আইডি সহ)
export const fetchTransactions = (userId: string) => {
  return api.get(`/transactions?userId=${userId}`);
};

// প্রোফাইল ডাটা আনার ফাংশন
export const getUserProfile = (id: string) => {
  return api.get(`/users/profile/${id}`);
};

export const deleteTransaction = (id: string) => api.delete(`/transactions/${id}`);

export default api;