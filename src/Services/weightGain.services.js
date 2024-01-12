import { sql } from '@vercel/postgres';
import AppError from '../Errors/App.error.js';

export const addWeightGainService = async (data) => {
  try {
    const insertWeightGainQuery = sql`
      INSERT INTO "weight_gain" (${Object.keys(data)})
      VALUES (${Object.values(data)})
      RETURNING *;
    `;

    const queryResult = await insertWeightGainQuery;
    return queryResult.rows[0];
  } catch (error) {
    console.error('Error adding weight history:', error);
    throw new AppError('Error adding weight history');
  }
};

export const getWeightGainService = async () => {
  try {
    const selectWeightGainQuery = sql`
      SELECT * FROM "weight_gain" ORDER BY "date" DESC;
    `;

    const queryResult = await selectWeightGainQuery;
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

    const selectWeightGainQuery = sql`
      SELECT * FROM "weight_gain" WHERE "baby_id" = ${babyId} ORDER BY "date" DESC;
    `;

    const queryResult = await selectWeightGainQuery;
    return queryResult.rows;
  } catch (error) {
    console.error('Error fetching weight history:', error);
    throw new AppError('Error fetching weight history');
  }
};

export const updateWeightGainService = async (weightGainId, data) => {
  const { baby_id, weight, date } = data;
  try {
    const updateWeightGainQuery = sql`
      UPDATE "weight_gain"
      SET baby_id = ${baby_id}, weight = ${weight}, date = ${date}
      WHERE id = ${weightGainId}
      RETURNING *;
    `;

    const queryResult = await updateWeightGainQuery;

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
    const deleteWeightGainQuery = sql`
      DELETE FROM "weight_gain" WHERE "id" = ${weightGainId}
      RETURNING *;
    `;

    const queryResult = await deleteWeightGainQuery;
    return queryResult.rows[0];
  } catch (error) {
    console.error('Error deleting weight history:', error);
    throw new AppError('Error deleting weight history');
  }
};
