import { DataSource } from 'typeorm';
import { envConfig } from './env.config';
import path from 'node:path';

// Import all entities explicitly
import { Student } from '../modules/student/entities/student.entity';
import { ExamSession } from '../modules/student/entities/ExamSession.entity';
import { Answer } from '../modules/student/entities/answer.entity';
import { Result } from '../modules/student/entities/result.entity';

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
        database: envConfig.DB_NAME,
        
        entities: [`${__dirname}/../modules/**/*.entity.{ts,js}`],
        migrations: [`${__dirname}/../database/migrations/*.{ts,js}`],
        
        synchronize: false,
        logging: envConfig.DB_LOGGING === true,

        charset: 'utf8mb4',
        timezone: '+07:00',               
        extra: {
          waitForConnections: true,
          connectionLimit: envConfig.DB_CONNECTION_LIMIT,
          queueLimit: envConfig.DB_QUEUE_LIMIT,
        },
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

// Export for use in repositories
export const AppDataSource = DatabaseConfig.getDataSource();
