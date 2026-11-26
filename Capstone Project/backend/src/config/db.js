import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ciphersense', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Warning] MongoDB connection error: ${error.message}`);
    console.log('[Database] If MongoDB is not running locally, please start MongoDB service or update MONGODB_URI in backend/.env');
  }
};
