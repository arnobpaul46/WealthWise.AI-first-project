import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('[Gemini] Warning: GEMINI_API_KEY is not set in the environment variables.');
}

export const genAI = new GoogleGenerativeAI(apiKey || '');

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({
    model: 'gemini-pro',
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      topK: 40,
      responseMimeType: 'application/json',
    },
  });
};

export default genAI;