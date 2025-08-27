import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const getIncomes = async (req, res) => {
  const { start, end } = req.query;
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  let query = 'SELECT * FROM incomes WHERE user_id = $1';
  const values = [userId];

  if (start) {
    query += ' AND date >= $' + (values.length + 1);
    values.push(new Date(start));
  }
  if (end) {
    query += ' AND date <= $' + (values.length + 1);
    values.push(new Date(end));
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error getting incomes' });
  }
};

export const getIncomeById = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'SELECT * FROM incomes WHERE id = $1 AND user_id = $2';
  try {
    const result = await pool.query(query, [req.params.id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Income not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error getting income' });
  }
};

export const createIncome = async (req, res) => {
  const { amount, date, source, description } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'INSERT INTO incomes (amount, date, source, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [amount, date, source, description, userId];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error creating income' });
  }
};

export const updateIncome = async (req, res) => {
  const { amount, date, source, description } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'UPDATE incomes SET amount = $1, date = $2, source = $3, description = $4 WHERE id = $5 AND user_id = $6 RETURNING *';
  const values = [amount, date, source, description, req.params.id, userId];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Income not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating income' });
  }
};

export const deleteIncome = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'DELETE FROM incomes WHERE id = $1 AND user_id = $2 RETURNING *';
  try {
    const result = await pool.query(query, [req.params.id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Income not found' });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting income' });
  }
};