import { sql } from '@vercel/postgres';
import AppError from '../Errors/App.error.js';

export const createSleepService = async (data) => {
  try {
    const { baby_id, date, start_time, duration } = data;
    const query = sql`
      INSERT INTO "sleep" (baby_id, date, start_time, duration)
      VALUES (${baby_id}, ${date}, ${start_time}, ${duration})
      RETURNING *;
    `;
    const result = await query;
    return result.rows[0];
  } catch (error) {
    throw new AppError('Error creating sleep record', error);
  }
};

export const listSleepService = async () => {
  try {
    const query = sql`SELECT * FROM "sleep";`;
    const result = await query;
    return result.rows;
  } catch (error) {
    throw new AppError('Error fetching sleep records from the database', error);
  }
};

export const listSleepByIdService = async (sleepId) => {
  try {
    const query = sql`SELECT * FROM "sleep" WHERE id = ${sleepId};`;
    const result = await query;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new AppError('Error fetching sleep record by ID', error);
  }
};

export const updateSleepByIdService = async (sleepId, data) => {
  try {
    const { baby_id, date, start_time, duration } = data;
    const query = sql`
      UPDATE "sleep"
      SET baby_id = ${baby_id}, date = ${date}, start_time = ${start_time}, duration = ${duration}
      WHERE id = ${sleepId}
      RETURNING *;
    `;
    const result = await query;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new AppError('Error updating sleep record by ID', error);
  }
};

export const deleteSleepByIdService = async (sleepId) => {
  try {
    const query = sql`DELETE FROM "sleep" WHERE id = ${sleepId} RETURNING *;`;
    const result = await query;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new AppError('Error deleting sleep record by ID', error);
  }
};
