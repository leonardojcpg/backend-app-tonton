import AppError from '../Errors/App.error.js';
import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const associateUserBabyService = async (userId, babyId) => {
  try {
    const query =
      'INSERT INTO "user_baby" (user_id, baby_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;';
    await pool.query(query, [userId, babyId]);

    const updateBabyQuery = 'UPDATE "baby" SET user_id = $1 WHERE id = $2;';
    await pool.query(updateBabyQuery, [userId, babyId]);

    const babyQuery = 'SELECT * FROM "baby" WHERE id = $1;';
    const babyResult = await pool.query(babyQuery, [babyId]);

    if (babyResult.rows.length === 0) {
      throw new AppError('Baby not found.');
    }

    return babyResult.rows[0];
  } catch (error) {
    throw new AppError('Error associating user with baby:', error);
  }
};

export const listBabyIdForUserService = async (userId) => {
  try {
    const query = 'SELECT baby_id FROM "user_baby" WHERE user_id = $1;';
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      throw new AppError('Baby not found for the given user.');
    }

    return result.rows[0].baby_id;
  } catch (error) {
    throw new AppError('Error getting baby for user:', error);
  }
};

export const disassociateUserBabyService = async (userId, babyId) => {
  try {
    const query = 'DELETE FROM "user_baby" WHERE user_id = $1 AND baby_id = $2;';
    await pool.query(query, [userId, babyId]);
  } catch (error) {
    throw new AppError('Error disassociating user from baby:', error);
  }
};
