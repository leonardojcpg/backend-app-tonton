import format from 'pg-format';
import { createPool } from '@vercel/postgres';
import AppError from '../Errors/App.error.js';

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const addWeightGainService = async (data) => {
  try {
    const queryFormat = format(
      'INSERT INTO "weight_gain" (%I) VALUES (%L) RETURNING *;',
      Object.keys(data),
      Object.values(data)
    );

    const queryResult = await pool.query(queryFormat);
    return queryResult.rows[0];
  } catch (error) {
    console.error('Error adding weight history:', error);
    throw new AppError('Error adding weight history');
  }
};

export const getWeightGainService = async () => {
  try {
    const queryFormat = 'SELECT * FROM "weight_gain" ORDER BY "date" DESC;';
    const queryResult = await pool.query(queryFormat);
    return queryResult.rows;
  } catch (error) {
    console.error('Error fetching weight history:', error);
    throw new AppError('Error fetching weight history');
  }
};

export const getWeightGainByIdService = async (babyId) => {
  try {
    if (babyId === null || babyId === undefined) {
      throw new AppError('Invalid babyId parameter');
    }

    const queryFormat = format(
      'SELECT * FROM "weight_gain" WHERE "baby_id" = %L ORDER BY "date" DESC;',
      babyId
    );

    const queryResult = await pool.query(queryFormat);
    return queryResult.rows;
  } catch (error) {
    console.error('Error fetching weight history:', error);
    throw new AppError('Error fetching weight history');
  }
};

export const updateWeightGainService = async (weightGainId, data) => {
  const { baby_id, weight, date } = data;
  try {
    const queryFormat = `
      UPDATE "weight_gain"
      SET baby_id = $1, weight = $2, date = $3
      WHERE id = $4
      RETURNING *;
    `;

    const queryResult = await pool.query(queryFormat, [
      baby_id,
      weight,
      date,
      weightGainId,
    ]);

    if (queryResult.rows.length === 0) {
      return null;
    }

    return queryResult.rows[0];
  } catch (error) {
    console.error('Error updating weight history:', error);
    throw new AppError('Error updating weight history');
  }
};

export const deleteWeightGainService = async (weightGainId) => {
  try {
    const queryFormat = format(
      'DELETE FROM "weight_gain" WHERE "id" = %L RETURNING *;',
      weightGainId
    );

    const queryResult = await pool.query(queryFormat);
    return queryResult.rows[0];
  } catch (error) {
    console.error('Error deleting weight history:', error);
    throw new AppError('Error deleting weight history');
  }
};
