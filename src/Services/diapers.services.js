import { sql } from '@vercel/postgres';
import AppError from '../Errors/App.error.js';

export const createDiaperService = async (data) => {
  try {
    const { baby_id, label, size, quantity } = data;
    const query = sql`
      INSERT INTO "diapers" (baby_id, label, size, quantity)
      VALUES (${baby_id}, ${label}, ${size}, ${quantity})
      RETURNING *;
    `;
    const result = await query;
    return result.rows[0];
  } catch (error) {
    throw new AppError('Error creating diaper record', error);
  }
};

export const listDiapersService = async () => {
  try {
    const query = sql`SELECT * FROM "diapers";`;
    const result = await query;
    return result.rows;
  } catch (error) {
    throw new AppError('Error fetching diaper records from the database', error);
  }
};

export const listDiapersByIdService = async (diaperId) => {
  try {
    const query = sql`SELECT * FROM "diapers" WHERE id = ${diaperId};`;
    const result = await query;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new AppError('Error fetching diaper record by ID', error);
  }
};

export const updateDiaperByIdService = async (diaperId, data) => {
  try {
    const { baby_id, label, size, quantity } = data;
    const query = sql`
      UPDATE "diapers"
      SET baby_id = ${baby_id}, label = ${label}, size = ${size}, quantity = ${quantity}
      WHERE id = ${diaperId}
      RETURNING *;
    `;
    const result = await query;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new AppError('Error updating diaper record by ID', error);
  }
};

export const deleteDiaperByIdService = async (diaperId) => {
  try {
    const query = sql`DELETE FROM "diapers" WHERE id = ${diaperId} RETURNING *;`;
    const result = await query;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    throw new AppError('Error deleting diaper record by ID', error);
  }
};
