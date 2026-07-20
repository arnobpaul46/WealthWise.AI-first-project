import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Ensure env variables are loaded (in case db.ts is imported before dotenv setup in app.ts)
dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;
    console.log("Attempting to connect to:", mongoURI);

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};
