import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * Auth Routes (/api/auth)
 * 
 * Publicly accessible routes for authentication.
 */

router.post('/register', register);
router.post('/login', login);

export default router;
