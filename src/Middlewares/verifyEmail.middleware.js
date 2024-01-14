import { createPool } from '@vercel/postgres';
import AppError from '../Errors/App.error.js';

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const verifyEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next();
  }

  try {
    const query = 'SELECT * FROM "users" WHERE "email" = $1';
    const queryResult = await pool.query(query, [email]);

    if (queryResult.rowCount) {
      throw new AppError('Email already exists.', 409);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
