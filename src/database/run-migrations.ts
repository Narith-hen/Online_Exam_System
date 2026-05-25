import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { DB_NAME } from '../config/database.config';

type DbEnv = {
  host: string;
  port: number;
  user: string;
  password: string;
};

function getDbEnv(): DbEnv {
  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
  };
}

function listSqlMigrations(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.sql'))
    .sort()
    .map((f) => path.join(dir, f));
}

async function run(): Promise<void> {
  const candidates = [
    path.join(process.cwd(), 'dist', 'database', 'migrations'),
    path.join(process.cwd(), 'src', 'database', 'migrations'),
  ];

  const migrationsDir = candidates.find((d) => fs.existsSync(d)) ?? candidates[candidates.length - 1];
  const files = listSqlMigrations(migrationsDir);
  if (files.length === 0) throw new Error(`No .sql migrations found in ${migrationsDir}`);

  const env = getDbEnv();

  const connection = await mysql.createConnection({
    host: env.host,
    port: env.port,
    user: env.user,
    password: env.password,
    multipleStatements: true,
  });

  try {
    for (const filePath of files) {
      const sql = fs.readFileSync(filePath, 'utf8');
      if (!sql.trim()) continue;
      await connection.query(sql);
      // eslint-disable-next-line no-console
      console.log(`Applied migration: ${path.basename(filePath)}`);
    }

    // eslint-disable-next-line no-console
    console.log(`Done. Database: ${DB_NAME}`);
  } finally {
    await connection.end();
  }
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});
