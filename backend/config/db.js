import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database using Mongoose.
 * 
 * If the connection fails, it catches the error, logs the reason, 
 * and forcefully exits the Node process to prevent the server from 
 * running in an unstable, disconnected state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit process with failure code 1
    process.exit(1);
  }
};

export default connectDB;
