import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const getCategories = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'SELECT * FROM categories WHERE user_id = $1';
  try {
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error getting categories' });
  }
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *';
  try {
    const result = await pool.query(query, [name, userId]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category' });
  }
};

export const updateCategory = async (req, res) => {
  const { name } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
  try {
    const result = await pool.query(query, [name, req.params.id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Category not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating category' });
  }
};

export const deleteCategory = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *';
  try {
    const result = await pool.query(query, [req.params.id, userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Category not found or in use' });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};