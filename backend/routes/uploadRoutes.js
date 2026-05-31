import express from 'express';
import { getUploadSignature } from '../controllers/uploadController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Upload Routes (/api/upload)
 */

// Private route: Only authenticated users should be able to generate an upload signature
router.get('/signature', verifyToken, getUploadSignature);

export default router;
