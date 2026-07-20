import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const processWithAI = async (text: string) => {
  const userId = localStorage.getItem('wealthwise_user_id') || '6a5dfdd8cd2228d081b6b080';
  const response = await api.post('/transactions/ai-process', { text, userId });
  return response.data;
};

export const fetchTransactions = () => api.get('/transactions');
export const deleteTransaction = (id: string) => api.delete(`/transactions/${id}`);

export default api;