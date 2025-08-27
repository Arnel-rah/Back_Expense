import express from 'express';
import { getReceipt } from '../controllers/receiptsController.js';
import { logRequest } from '../middlewares/example.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(logRequest);
router.get('/:idExpense', authenticate, getReceipt);

export default router;