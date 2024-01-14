import { createPool } from '@vercel/postgres';
import AppError from '../Errors/App.error.js';

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const verifyUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const queryResult = await pool.query(
      'SELECT * FROM "users" WHERE "id" = $1',
      [userId]
    );

    if (!queryResult.rowCount) {
      throw new AppError('Client not found');
    }

    const foundClient = queryResult.rows[0];
    res.locals = { ...res.locals, foundClient };
    return next();
  } catch (error) {
    return next(error);
  }
};
