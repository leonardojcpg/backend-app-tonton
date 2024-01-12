import { sql } from '@vercel/postgres';
import { listUserSchema, userReturnSchema } from '../Schemas/users.schema.js';
import AppError from '../Errors/App.error.js';
import bcrypt from 'bcryptjs';

const { hash } = bcrypt;

export const createUsersService = async (data) => {
  data.password = await hash(data.password, 10);

  const insertUserQuery = sql`
    INSERT INTO "users" (${Object.keys(data)}) VALUES (${Object.values(data)})
    RETURNING *;
  `;
  const queryResult = await insertUserQuery;
  return userReturnSchema.parse(queryResult.rows[0]);
};

export const listUsersService = async () => {
  try {
    const listUserQuery = sql`SELECT * FROM "users";`;
    const listUserQueryResult = await listUserQuery;
    return listUserSchema.parse(listUserQueryResult.rows);
  } catch (error) {
    throw new AppError('Error fetching users from the database');
  }
};

export const listUsersByIdService = async (userId) => {
  try {
    const query = sql`SELECT * FROM "users" WHERE id = ${userId};`;
    const result = await query;

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new AppError('Error fetching user by ID');
  }
};

export const updateUserService = async (userId, data) => {
  try {
    if (typeof data.password === 'string') {
      data.password = await hash(data.password, 10);
    } else {
      throw new AppError('Invalid password format', 400);
    }

    const updateUserQuery = sql`
      UPDATE "users" SET ${Object.entries(data).map(([key, value]) => `"${key}" = ${value}`).join(', ')}
      WHERE "id" = ${userId} RETURNING *;
    `;

    const updateUserQueryResult = await updateUserQuery;

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
    const deleteUserBabyQuery = sql`DELETE FROM "user_baby" WHERE "user_id" = ${userId};`;
    await deleteUserBabyQuery;

    const deleteUserQuery = sql`DELETE FROM "users" WHERE "id" = ${userId} RETURNING *;`;
    const deleteUserQueryResult = await deleteUserQuery;

    return deleteUserQueryResult.rows[0];
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new AppError('Error deleting user', 500);
  }
};
