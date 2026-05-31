import User from '../models/User.js';
import bcrypt from 'bcryptjs';

/**
 * seedInitialAdmin
 * 
 * Secure database initialization script.
 * Provisions the platform's first Root Admin directly into MongoDB.
 */
export const seedInitialAdmin = async () => {
  try {
    // 1. Check if the admin account already exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (adminExists) {
      console.log('Admin account already exists. Seeding skipped.');
      return;
    }

    // 2. If the user doesn't exist, we provision the Root Admin.
    // Note: Our User model already has a `pre('save')` hook that hashes the password.
    // However, as requested, we can explicitly hash it here and use insertOne, 
    // OR we can rely on our Mongoose schema to do it securely. 
    // We will use Mongoose's create() so it passes schema validation, 
    // which automatically invokes the bcrypt hashing hook.

    await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD, // Hashed by User schema pre-save hook
      role: 'admin',      // Bypassing default 'user'
      status: 'approved', // Bypassing default 'pending'
      contactInfo: {
        phone: 'N/A',
        address: 'N/A'
      }
    });

    console.log('Root Admin successfully provisioned.');
  } catch (error) {
    console.error(`Error provisioning Root Admin: ${error.message}`);
  }
};
