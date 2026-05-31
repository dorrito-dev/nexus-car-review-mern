import Review from '../models/Review.js';
import Car from '../models/Car.js';

// @desc    Create a new review (and upsert Car)
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    // Check if user is approved to submit reviews
    if (req.user.status !== 'approved') {
      return res.status(403).json({ message: 'Your account is pending or banned. You cannot submit reviews.' });
    }

    // Basic validation
    const { make, model, year, rating, reviewText, price, referenceLink, keySpecs, images } = req.body;

    if (!make || !model || !rating || !reviewText) {
      return res.status(400).json({ message: 'Please provide make, model, rating, and review text.' });
    }

    const review = await Review.create({
      user: req.user.id,
      make,
      model,
      year,
      rating,
      reviewText,
      price,
      referenceLink,
      keySpecs,
      images,
      status: 'pending' // Default status
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all approved public reviews
// @route   GET /api/reviews/public
// @access  Public
export const getPublicReviews = async (req, res, next) => {
  try {
    const { make, type, minPrice, maxPrice, sort = '-createdAt' } = req.query;

    // Build filter object
    const filter = { status: 'approved' }; // Only show approved reviews to public

    if (make) filter.make = make;
    if (type) filter.tags = { $in: [type] };
    if (minPrice || maxPrice) {
      filter.rawPrice = {};
      if (minPrice) filter.rawPrice.$gte = Number(minPrice);
      if (maxPrice) filter.rawPrice.$lte = Number(maxPrice);
    }

    const reviews = await Review.find(filter)
      .populate('user', 'name experience')
      .sort(sort);

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending reviews for moderation
// @route   GET /api/reviews/pending
// @access  Private/Admin
export const getAdminReviews = async (req, res, next) => {
  try {
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    const reviews = await Review.find(statusFilter)
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a review
// @route   PATCH /api/reviews/:id/approve
// @access  Private/Admin
export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      review.status = 'approved';
      review.adminMessage = ''; // Clear any previous rejection message
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a review
// @route   PATCH /api/reviews/:id/reject
// @access  Private/Admin
export const rejectReview = async (req, res, next) => {
  try {
    const { adminMessage } = req.body;
    
    if (!adminMessage) {
      return res.status(400).json({ message: 'Please provide a reason for rejection (adminMessage)' });
    }

    const review = await Review.findById(req.params.id);

    if (review) {
      review.status = 'rejected';
      review.adminMessage = adminMessage;
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own reviews
// @route   GET /api/reviews/me
// @access  Private
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
