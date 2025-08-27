import express from 'express';
import { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } from '../controllers/expensesController.js';
import { logRequest, upload } from '../middlewares/example.js';
import { validateExpense } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(logRequest);
router.get('/', authenticate, getExpenses);
router.get('/:id', authenticate, getExpenseById);
router.post('/', authenticate, upload.single('receipt'), validateExpense, createExpense);
router.put('/:id', authenticate, upload.single('receipt'), validateExpense, updateExpense);
router.delete('/:id', authenticate, deleteExpense);

export default router;