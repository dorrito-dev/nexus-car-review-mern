import express from 'express';
import { getUserProfile, getUsers, updateUserStatus, deleteUser } from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * User Routes (/api/users)
 */

// Private route: Any authenticated user can view their own profile
router.get('/me', verifyToken, getUserProfile);

// Admin routes: Require both valid token AND 'admin' role
router.get('/', verifyToken, isAdmin, getUsers);
router.patch('/:id/status', verifyToken, isAdmin, updateUserStatus);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;
