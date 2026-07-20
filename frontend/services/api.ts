// frontend/services/api.ts

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// মেইন ফিক্স: এখানে (text: string, userId?: string) যোগ করা হয়েছে
export const processWithAI = async (text: string, userId?: string) => {
  const response = await api.post('/transactions/ai-process', { 
    text,
    userId: userId || '669b9b9b9b9b9b9b9b9b9b9b' // যদি আইডি না থাকে তবে ডিফল্ট আইডি
  });
  return response.data;
};

export const fetchTransactions = () => api.get('/transactions');
export const deleteTransaction = (id: string) => api.delete(`/transactions/${id}`);

export default api;