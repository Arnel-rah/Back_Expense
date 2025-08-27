import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { userId } = jwt.verify(token, config.jwtSecret);
  const query = 'SELECT email, created_at FROM users WHERE id = $1';
  try {
    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error getting profile' });
  }
};