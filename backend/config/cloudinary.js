import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure Cloudinary SDK with environment variables.
 * This instance can be imported wherever cloudinary functionality is needed.
 */
export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export default cloudinary;
