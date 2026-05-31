import express from 'express';
import { createReview, getPublicReviews, getPendingReviews, updateReviewStatus } from '../controllers/reviewController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Review Routes (/api/reviews)
 */

// Public route: Anyone can view approved reviews
router.get('/public', getPublicReviews);

// Private route: Authenticated users can submit a review
router.post('/', verifyToken, createReview);

// Admin routes: Require both valid token AND 'admin' role
router.get('/pending', verifyToken, isAdmin, getPendingReviews);
router.patch('/:id/status', verifyToken, isAdmin, updateReviewStatus);

export default router;
