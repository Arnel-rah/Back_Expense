import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import fs from 'fs';
import path from 'path';

export const getReceipt = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = jwt.verify(token, config.jwtSecret).userId;
  const query = 'SELECT receipt FROM expenses WHERE id = $1 AND user_id = $2';
  try {
    const result = await pool.query(query, [req.params.idExpense, userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Receipt not found' });
    const filePath = path.join('uploads', result.rows[0].receipt);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error getting receipt' });
  }
};