import { createPool } from '@vercel/postgres';
import format from 'pg-format';
import AppError from '../Errors/App.error.js';

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const createBabyService = async (data) => {
  try {
    const queryFormat = format(
      'INSERT INTO "baby" (%I) VALUES (%L) RETURNING *;',
      Object.keys(data),
      Object.values(data)
    );

    const queryResult = await pool.query(queryFormat);
    return queryResult.rows[0];
  } catch (error) {
    console.error('Error creating baby:', error);
    throw new AppError('Error creating baby');
  }
};

export const listBabyService = async () => {
  try {
    const listBabyQuery = 'SELECT * FROM "baby";';
    const listBabyQueryResult = await pool.query(listBabyQuery);
    return listBabyQueryResult.rows;
  } catch (error) {
    console.error('Error fetching babies from the database:', error);
    throw new AppError('Error fetching babies from the database');
  }
};

export const listBabiesByIdService = async (babyId) => {
  try {
    if (babyId === null || isNaN(babyId) || !Number.isInteger(Number(babyId))) {
      throw new AppError("Invalid babyId parameter");
    }

    const query = "SELECT * FROM baby WHERE id = $1";

    const result = await pool.query(query, [babyId]);

    if (result.rows.length === 0) {
      return null;
    }

    const baby = result.rows[0];
    return baby;
  } catch (error) {
    console.error("Error fetching baby by ID:", error);
    throw new Error("Error fetching baby by ID");
  }
};


export const updateBabyService = async (babyId, data) => {
  try {
    const updateBabyQueryFormat = format(
      'UPDATE "baby" SET (%I) = ROW (%L) WHERE "id" = $1 RETURNING *;',
      Object.keys(data),
      Object.values(data)
    );

    const updateBabyQueryResult = await pool.query(updateBabyQueryFormat, [babyId]);
    return updateBabyQueryResult.rows[0];
  } catch (error) {
    console.error('Error updating baby:', error);
    throw new AppError('Error updating baby');
  }
};

export const deleteBabyService = async (babyId) => {
  try {
    const deleteBabyQuery = format('DELETE FROM "baby" WHERE "id" = $1;');
    const deleteBabyQueryResult = await pool.query(deleteBabyQuery, [babyId]);
    return deleteBabyQueryResult.rows[0];
  } catch (error) {
    console.error('Error deleting baby:', error);
    throw new AppError('Error deleting baby');
  }
};