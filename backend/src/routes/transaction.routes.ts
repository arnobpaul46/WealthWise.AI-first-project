import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  processAITransaction,
} from '../controllers/transaction.controller.js';

const router = Router();

// Endpoint for listing transactions and creating a new transaction
router.route('/')
  .post(createTransaction)
  .get(getTransactions);

// AI-assisted transaction processing
router.post('/ai-process', processAITransaction);

// Endpoints for details, editing, and deleting standard transactions
router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
