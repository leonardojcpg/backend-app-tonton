// database.js
import { Client } from '@vercel/postgres';

export const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const startDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to the database!');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
};
