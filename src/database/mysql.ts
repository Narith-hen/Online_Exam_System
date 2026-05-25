import mysql from 'mysql2/promise';
import { DB_NAME } from '../config/database.config';

let pool: mysql.Pool | null = null;

function createPool(): mysql.Pool {
  const host = process.env.DB_HOST ?? 'localhost';
  const port = Number(process.env.DB_PORT ?? 3306);
  const user = process.env.DB_USER ?? 'root';
  const password = process.env.DB_PASSWORD ?? '';

  return mysql.createPool({
    host,
    port,
    user,
    password,
    database: DB_NAME,
    connectionLimit: 10,
  });
}

export function getMysqlPool(): mysql.Pool {
  if (!pool) pool = createPool();
  return pool;
}

