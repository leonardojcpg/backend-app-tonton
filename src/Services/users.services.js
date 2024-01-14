import format from 'pg-format';
import { createPool } from '@vercel/postgres';
import AppError from '../Errors/App.error.js';

import pkg from 'bcryptjs';
import { listUserSchema, userReturnSchema } from '../Schemas/users.schema.js';
const { hash } = pkg;

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const createUsersService = async (data) => {
  try {
    data.password = await hash(data.password, 10);

    const queryFormat = format(
      'INSERT INTO "users" (%I) VALUES (%L) RETURNING *;',
      Object.keys(data),
      Object.values(data)
    );
    const queryResult = await pool.query(queryFormat);
    return userReturnSchema.parse(queryResult.rows[0]);
  } catch (error) {
    throw new AppError('Error creating user', 500);
  }
};

export const listUsersService = async () => {
  try {
    const listUserQuery = 'SELECT * FROM "users";';
    const listUserQueryResult = await pool.query(listUserQuery);
    return listUserSchema.parse(listUserQueryResult.rows);
  } catch (error) {
    throw new AppError('Error fetching users from the database', 500);
  }
};

export const listUsersByIdService = async (userId) => {
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new AppError('Error fetching user by ID', 500);
  }
};

export const updateUserService = async (userId, data) => {
  try {
    if (typeof data.password === 'string') {
      data.password = await hash(data.password, 10);
    } else {
      throw new AppError('Invalid password format', 400);
    }

    const updateUserQueryFormat = format(
      'UPDATE "users" SET (%I) = ROW (%L) WHERE "id" = $1 RETURNING *;',
      Object.keys(data),
      Object.values(data)
    );

    const updateUserQueryResult = await pool.query(updateUserQueryFormat, [userId]);

    if (updateUserQueryResult.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return userReturnSchema.parse(updateUserQueryResult.rows[0]);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError('Error updating user', 500);
    }
  }
};

export const deleteUserService = async (userId) => {
  try {
    const deleteUserBabyQuery = format('DELETE FROM "user_baby" WHERE "user_id" = $1;', userId);
    await pool.query(deleteUserBabyQuery, [userId]);

    const deleteUserQuery = format('DELETE FROM "users" WHERE "id" = $1 RETURNING *;', userId);
    const deleteUserQueryResult = await pool.query(deleteUserQuery, [userId]);

    return deleteUserQueryResult.rows[0];
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new AppError('Error deleting user', 500);
  }
};
