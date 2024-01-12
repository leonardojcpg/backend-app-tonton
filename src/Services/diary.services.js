import { sql } from '@vercel/postgres';
import AppError from '../Errors/App.error.js';

export const createDiaryService = async (data) => {
  try {
    const { baby_id, date, note } = data;
    const query = sql`
      INSERT INTO "diary" (baby_id, date, note)
      VALUES (${baby_id}, ${date}, ${note})
      RETURNING *;
    `;
    const result = await query;
    return result.rows[0];
  } catch (error) {
    throw new AppError('Error creating diary entry', error);
  }
};

export const listDiaryService = async () => {
  try {
    const query = sql`SELECT * FROM "diary";`;
    const result = await query;
    return result.rows;
  } catch (error) {
    throw new AppError('Error fetching diary entries from the database', error);
  }
};

export const listDiaryByIdService = async (diaryId) => {
  try {
    const query = sql`SELECT * FROM "diary" WHERE id = ${diaryId};`;
    const result = await query;

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
    const query = sql`
      UPDATE "diary"
      SET baby_id = ${baby_id}, date = ${date}, note = ${note}
      WHERE id = ${diaryId}
      RETURNING *;
    `;
    const result = await query;

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
    const query = sql`DELETE FROM "diary" WHERE id = ${diaryId} RETURNING *;`;
    const result = await query;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new AppError('Error deleting diary entry by ID', error);
  }
};
