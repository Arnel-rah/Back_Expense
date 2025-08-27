import express from 'express';
import { getIncomes, getIncomeById, createIncome, updateIncome, deleteIncome } from '../controllers/incomesController.js';
import { logRequest } from '../middlewares/example.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(logRequest);
router.get('/', authenticate, getIncomes);
router.get('/:id', authenticate, getIncomeById);
router.post('/', authenticate, createIncome);
router.put('/:id', authenticate, updateIncome);
router.delete('/:id', authenticate, deleteIncome);

export default router;