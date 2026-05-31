import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
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
  type: {
    type: String, // e.g., Sedan, SUV, EV, Performance
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add the price of the car']
  },
  keySpecs: {
    type: String, // E.g. "Range: 300 miles, 0-60mph: 2.6s, Power: 750hp..."
    trim: true
  },
  referenceLink: {
    type: String,
    match: [
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  reviews: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Review'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a combination of Make and Model is unique so we don't duplicate cars
carSchema.index({ make: 1, model: 1 }, { unique: true });

export default mongoose.model('Car', carSchema);
