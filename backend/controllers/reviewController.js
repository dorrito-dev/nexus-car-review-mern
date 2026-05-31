import Review from '../models/Review.js';
import Car from '../models/Car.js';

// @desc    Create a new review (and upsert Car)
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { make, model, type, price, keySpecs, referenceLink, rating, content, images } = req.body;

    // Ensure user is authorized (status must be approved to auto-publish? User requested new users default to pending. We assume they can submit, but review goes to pending)
    
    // Upsert Car
    let car = await Car.findOne({ make, model });
    if (!car) {
      car = await Car.create({
        make,
        model,
        type,
        price,
        keySpecs,
        referenceLink
      });
    }

    // Create Review linked to User and Car
    const review = await Review.create({
      user: req.user.id,
      car: car._id,
      rating,
      content,
      images,
      status: 'pending' // Default to pending for moderation
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all approved public reviews
// @route   GET /api/reviews/public
// @access  Public
export const getPublicReviews = async (req, res) => {
  try {
    const { make, type } = req.query;
    
    // We could build a complex filter query here, but since the assignment filters frontend, we return all approved.
    const reviews = await Review.find({ status: 'approved' })
      .populate('user', 'name contactInfo')
      .populate('car')
      .sort({ createdAt: -1 });

    // Optional basic filtering
    let filteredReviews = reviews;
    if (make) {
      filteredReviews = filteredReviews.filter(r => r.car.make === make);
    }
    if (type) {
      filteredReviews = filteredReviews.filter(r => r.car.type === type);
    }

    res.json(filteredReviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all pending reviews for moderation
// @route   GET /api/reviews/pending
// @access  Private/Admin
export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('car')
      .sort({ createdAt: 1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update review status (Approve/Reject)
// @route   PATCH /api/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);

    if (review) {
      review.status = status;
      const updatedReview = await review.save();

      // If approved, add to Car's review array
      if (status === 'approved') {
        const car = await Car.findById(review.car);
        if (car && !car.reviews.includes(review._id)) {
          car.reviews.push(review._id);
          await car.save();
        }
      }

      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
