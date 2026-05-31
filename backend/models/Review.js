import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  make: {
    type: String,
    required: [true, 'Please add a car make'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Please add a car model'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Please add the car year']
  },
  type: {
    type: String, // e.g., Sedan, SUV, EV, Performance
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Please add the price of the car']
  },
  keySpecs: {
    type: String,
    trim: true
  },
  referenceLink: {
    type: String,
    match: [
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please use a valid URL'
    ]
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: [true, 'Please add review content'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters long']
  },
  images: [{
    type: String,
    match: [
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please use a valid image URL'
    ]
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminMessage: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Review', reviewSchema);
