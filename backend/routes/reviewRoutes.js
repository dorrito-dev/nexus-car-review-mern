import express from 'express';
import { createReview, getPublicReviews, getAdminReviews, approveReview, rejectReview, getMyReviews } from '../controllers/reviewController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Review Routes (/api/reviews)
 */

// Public route: Anyone can view approved reviews
router.get('/public', getPublicReviews);

// Private route: Authenticated users can submit a review and view their own
router.post('/', verifyToken, createReview);
router.get('/me', verifyToken, getMyReviews);

// Admin routes: Require both valid token AND 'admin' role
router.get('/pending', verifyToken, isAdmin, getAdminReviews);
router.patch('/:id/approve', verifyToken, isAdmin, approveReview);
router.patch('/:id/reject', verifyToken, isAdmin, rejectReview);

export default router;
