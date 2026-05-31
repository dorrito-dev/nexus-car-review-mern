import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import Route Modules
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Database Connection & Initialization
import connectDB from './config/db.js';
// import { seedInitialAdmin } from './config/seedAdmin.js';

connectDB().then(() => {
  console.log("Connected to mongodb instance")
}).catch((err) => {
  console.log("Error connecting to mongodb instance", err)
})

const app = express();

/**
 * Standard Middlewares
 */
// Safely configure CORS to allow requests from our frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse incoming JSON payloads
app.use(express.json());

/**
 * API Routes Mounting
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running beautifully.' });
});

/**
 * Global Error Handler Middleware
 * 
 * Catches any unhandled errors or invalid routes and ensures the server 
 * returns a formatted JSON response instead of crashing or leaking HTML stack traces.
 */
// Catch 404 Not Found
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Centralized Error Response
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    // Only leak stack traces in development environment for security
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});