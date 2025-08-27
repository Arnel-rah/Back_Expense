import express from 'express';
import { getMonthlySummary, getSummary, getAlerts } from '../controllers/summaryController.js';
import { logRequest } from '../middlewares/example.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(logRequest);
router.get('/monthly', authenticate, getMonthlySummary);
router.get('/', authenticate, getSummary);
router.get('/alerts', authenticate, getAlerts);

export default router;