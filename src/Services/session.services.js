import jwt from 'jsonwebtoken';
import { createPool } from '@vercel/postgres';
import AppError from '../Errors/App.error.js';
import bcrypt from 'bcryptjs';

const { compare } = bcrypt;
const { sign } = jwt;

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const loginService = async (data) => {
  try {
    const loginQuery = await pool.query('SELECT * FROM "users" WHERE "email" = $1;', [data.email]);

    if (loginQuery.rowCount === 0) {
      throw new AppError('Email does not exist.', 404);
    }

    const user = loginQuery.rows[0];
    const verifyPassword = await compare(data.password, user.password);

    if (!verifyPassword) {
      throw new AppError('Password or email is incorrect.', 401);
    }

    const token = sign(
      { email: user.email, password: user.password },
      process.env.JWT_SECRET,
      { subject: user.id.toString(), expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token };
  } catch (error) {
    throw new AppError('Error during login process', error);
  }
};
