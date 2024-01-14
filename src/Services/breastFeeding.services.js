import { createPool } from '@vercel/postgres';
import format from 'pg-format';
import AppError from '../Errors/App.error.js';

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const createBreastFeedingService = async (data) => {
  try {
    const queryFormat = format(
      'INSERT INTO "breast_feeding" (%I) VALUES (%L) RETURNING *;',
      Object.keys(data),
      Object.values(data)
    );

    const queryResult = await pool.query(queryFormat);
    return queryResult.rows[0];
  } catch (error) {
    throw new AppError('Error creating breast feeding:', error);
  }
};

export const listBreastFeedingService = async () => {
  try {
    const listBreastFeedingQuery = 'SELECT * FROM "breast_feeding";';
    const listBreastFeedingQueryResult = await pool.query(listBreastFeedingQuery);
    return listBreastFeedingQueryResult.rows;
  } catch (error) {
    throw new AppError('Error fetching breast feedings from the database');
  }
};

export const listBreastFeedingByIdService = async (breastFeedingId) => {
  try {
    const query = 'SELECT * FROM "breast_feeding" WHERE id = $1;';
    const result = await pool.query(query, [breastFeedingId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching breast feeding by ID:', error);
    throw new AppError('Error fetching breast feeding by ID');
  }
};

export const updateBreastFeedingService = async (breastFeedingId, data) => {
  try {
    const updateBreastFeedingQueryFormat = format(
      'UPDATE "breast_feeding" SET (%I) = ROW (%L) WHERE "id" = $1 RETURNING *;',
      Object.keys(data),
      Object.values(data)
    );

    const updateBreastFeedingQueryResult = await pool.query(updateBreastFeedingQueryFormat, [breastFeedingId]);
    return updateBreastFeedingQueryResult.rows[0];
  } catch (error) {
    throw new AppError('Error updating breast feeding:', error);
  }
};

export const deleteBreastFeedingService = async (breastFeedingId) => {
  try {
    const deleteBreastFeedingQuery = format(
      'DELETE FROM "breast_feeding" WHERE "id" = $1 RETURNING *;'
    );

    const deleteBreastFeedingQueryResult = await pool.query(deleteBreastFeedingQuery, [breastFeedingId]);
    return deleteBreastFeedingQueryResult.rows[0];
  } catch (error) {
    throw new AppError('Error deleting breast feeding:', error);
  }
};
