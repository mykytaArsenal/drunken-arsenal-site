import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  console.warn('DATABASE_URL is not set, DB features disabled in dev.');
}

export const sql = connectionString ? neon(connectionString) : null;
