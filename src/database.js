import { createPool } from '@vercel/postgres';

export const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const startDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to the database!');
    client.release(); // Release the client back to the pool immediately after connecting
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
};
