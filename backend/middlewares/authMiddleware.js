import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * verifyToken Middleware
 * 
 * Securely extracts the JWT from the Authorization header.
 * Verifies the token signature and attaches the decoded user payload to req.user.
 * Prevents server crashes by wrapping logic in a try-catch and returning clean JSON errors.
 */
export const verifyToken = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and follows the 'Bearer <token>' pattern
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token string
      token = req.headers.authorization.split(' ')[1];

      // Verify token authenticity
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Attach user details to the request object, explicitly excluding the password hash
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User associated with this token no longer exists' });
      }

      next(); // Proceed to the next middleware or controller
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
  }

  // If no token was provided in the headers
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

/**
 * isAdmin Middleware
 * 
 * Role-Based Access Control (RBAC). 
 * Must be used strictly *after* verifyToken in the route chain.
 * Checks if the authenticated user possesses the 'admin' role.
 */
export const isAdmin = (req, res, next) => {
  // Ensure req.user exists (verifyToken must run first) and check role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Admin privileges required' });
  }
};
