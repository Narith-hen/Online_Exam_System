import { DataSource } from 'typeorm';
import { envConfig } from './env.config';
import path from 'node:path';

// Student entities
import { Student } from '../modules/student/entities/student.entity';
import { ExamSession } from '../modules/student/entities/ExamSession.entity';
import { Answer as StudentAnswer } from '../modules/student/entities/answer.entity';
import { Result } from '../modules/student/entities/result.entity';

// Teacher entities
import { User } from '../modules/teacher/entities/user.entity';
import { ExamEntity } from '../modules/teacher/entities/exam.entity';
import { QuestionEntity } from '../modules/teacher/entities/question.entity';
import { Answer as TeacherAnswer } from '../modules/teacher/entities/answer.entity';
import { TeacherToken } from '../modules/teacher/entities/teacherToken';

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

        entities: [
          Student, ExamSession, StudentAnswer, Result,
          User, ExamEntity, QuestionEntity, TeacherAnswer, TeacherToken,
        ],
        migrations: [`${__dirname}/../database/migrations/*.{ts,js}`],

        synchronize: true,
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

export const AppDataSource = DatabaseConfig.getDataSource();
