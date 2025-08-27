import express from "express";
import cors from "cors";
import expensesRouter from "./routes/expenses.route.js";
import authRouter from "./routes/auth.route.js";
import incomesRouter from "./routes/incomes.route.js";
import categoriesRouter from "./routes/categories.route.js";
import summaryRouter from "./routes/summary.route.js";
import receiptsRouter from "./routes/receipts.route.js";
import profileRouter from "./routes/profile.route.js";
import { logRequest } from "./middlewares/example.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(logRequest);
app.use('/api/auth', authRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/incomes', incomesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/receipts', receiptsRouter);
app.use('/api/user', profileRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});