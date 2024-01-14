import { createPool } from '@vercel/postgres';
import AppError from '../Errors/App.error.js';

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const createDiaryService = async (data) => {
  try {
    const { baby_id, date, note } = data;
    const query = `
      INSERT INTO "diary" (baby_id, date, note)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [baby_id, date, note]);
    return result.rows[0];
  } catch (error) {
    throw new AppError('Error creating diary entry', error);
  }
};

export const listDiaryService = async () => {
  try {
    const query = 'SELECT * FROM "diary";';
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new AppError('Error fetching diary entries from the database', error);
  }
};

export const listDiaryByIdService = async (diaryId) => {
  try {
    const query = 'SELECT * FROM "diary" WHERE id = $1;';
    const result = await pool.query(query, [diaryId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new AppError('Error fetching diary entry by ID', error);
  }
};

export const updateDiaryByIdService = async (diaryId, data) => {
  try {
    const { baby_id, date, note } = data;
    const query = `
      UPDATE "diary"
      SET baby_id = $1, date = $2, note = $3
      WHERE id = $4
      RETURNING *;
    `;
    const result = await pool.query(query, [baby_id, date, note, diaryId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new AppError('Error updating diary entry by ID', error);
  }
};

export const deleteDiaryByIdService = async (diaryId) => {
  try {
    const query = 'DELETE FROM "diary" WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [diaryId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new AppError('Error deleting diary entry by ID', error);
  }
};
