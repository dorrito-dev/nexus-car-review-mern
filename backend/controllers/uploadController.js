import cloudinary from '../config/cloudinary.js';

/**
 * @desc    Get Cloudinary upload signature
 * @route   GET /api/upload/signature
 * @access  Private (Requires token)
 * 
 * SECURITY NECESSITY:
 * Instead of routing image data through our backend (which consumes server bandwidth 
 * and memory), we use a "Signed Upload" pattern. Our server uses its hidden API_SECRET 
 * to generate a cryptographic signature for a specific timestamp. 
 * The React frontend can then safely send the image directly to Cloudinary's servers, 
 * proving it has our backend's authorization via this signature.
 */
export const getUploadSignature = (req, res, next) => {
  try {
    // Strict production check to prevent hanging sockets
    if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cloudinary environment variables are missing on the production server. Uploads disabled.' 
      });
    }
    // Generate a precise UNIX timestamp in seconds
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Create the cryptographic signature required by Cloudinary
    // We sign the timestamp and an optional folder destination
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'nexus_car_reviews'
      },
      process.env.CLOUDINARY_API_SECRET
    );

    // Return all necessary credentials for the frontend to execute the direct upload
    res.status(200).json({
      timestamp,
      signature,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY
    });
  } catch (error) {
    next(error);
  }
};
