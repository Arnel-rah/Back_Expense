import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const getExpenses = async (req, res) => {
  const { start, end, category, type } = req.query;
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  let query = 'SELECT * FROM expenses WHERE user_id = $1';
  const values = [userId];

  if (start) {
    query += ' AND date >= $' + (values.length + 1);
    values.push(new Date(start));
  }
  if (end) {
    query += ' AND date <= $' + (values.length + 1);
    values.push(new Date(end));
  }
  if (category) {
    query += ' AND category_id = $' + (values.length + 1);
    values.push(category);
  }
  if (type) {
    query += ' AND type = $' + (values.length + 1);
    values.push(type);
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error getting expenses' });
  }
};

export const getExpenseById = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'SELECT * FROM expenses WHERE id = $1 AND user_id = $2';
  try {
    const result = await pool.query(query, [req.params.id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Expense not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error getting expense' });
  }
};

export const createExpense = async (req, res) => {
  const { amount, date, category_id, description, type, start_date, end_date } = req.body;
  const receipt = req.file ? req.file.filename : null;
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'INSERT INTO expenses (amount, date, category_id, description, type, start_date, end_date, receipt, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
  const values = [amount, type === 'one-time' ? date : null, category_id, description, type, type === 'recurring' ? start_date : null, type === 'recurring' ? end_date : null, receipt, userId];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error creating expense' });
  }
};

export const updateExpense = async (req, res) => {
  const { amount, date, category_id, description, type, start_date, end_date } = req.body;
  const receipt = req.file ? req.file.filename : null;
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'UPDATE expenses SET amount = $1, date = $2, category_id = $3, description = $4, type = $5, start_date = $6, end_date = $7, receipt = $8 WHERE id = $9 AND user_id = $10 RETURNING *';
  const values = [amount, type === 'one-time' ? date : null, category_id, description, type, type === 'recurring' ? start_date : null, type === 'recurring' ? end_date : null, receipt, req.params.id, userId];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Expense not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating expense' });
  }
};

export const deleteExpense = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *';
  try {
    const result = await pool.query(query, [req.params.id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Expense not found' });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense' });
  }
};