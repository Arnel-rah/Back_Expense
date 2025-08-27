import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
  try {
    const result = await pool.query(query, [email, hashedPassword]);
    const token = jwt.sign({ userId: result.rows[0].id }, config.jwtSecret);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: 'Email already exists' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = $1';
  try {
    const result = await pool.query(query, [email]);
    const user = result.rows[0];
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, config.jwtSecret);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login error' });
  }
};

export const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { userId } = jwt.verify(token, config.jwtSecret);
  const query = 'SELECT email, created_at FROM users WHERE id = $1';
  try {
    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Profile error' });
  }
};