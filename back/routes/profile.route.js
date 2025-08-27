import express from 'express';
import { getProfile } from '../controllers/profileController.js';
import { logRequest } from '../middlewares/example.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(logRequest);
router.get('/', authenticate, getProfile);

export default router;
