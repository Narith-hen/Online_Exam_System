import { DataSource } from 'typeorm';
import { envConfig } from './env.config';
import path from 'node:path';

export const DB_NAME = envConfig.DB_NAME;

export class DatabaseConfig {
  private static dataSource: DataSource;

  static getDataSource(): DataSource {
    if (!DatabaseConfig.dataSource) {
      const rootDir = path.join(__dirname, '..');
      DatabaseConfig.dataSource = new DataSource({
        type: 'mysql',
        host: envConfig.DB_HOST,
        port: envConfig.DB_PORT,
        username: envConfig.DB_USERNAME,
        password: envConfig.DB_PASSWORD,
        database: DB_NAME,

        entities: [path.join(rootDir, 'modules', '**', '*.entity.{ts,js}')],
        migrations: [path.join(rootDir, 'database', 'migrations', '*.{ts,js}')],

        synchronize: false,
        logging: envConfig.DB_LOGGING === true,

        charset: 'utf8mb4',
        timezone: '+07:00',
      });
    }
    return DatabaseConfig.dataSource;
  }

  static async connect(): Promise<void> {
    try {
      const dataSource = this.getDataSource();
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
        console.log('✅ MySQL Database connected successfully');
      }
    } catch (error: any) {
      console.error('❌ MySQL Database connection failed:', error.message);
      throw error;
    }
  }
}

export const AppDataSource = DatabaseConfig.getDataSource();
