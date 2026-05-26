import { DataSource } from 'typeorm';
import { envConfig } from './env.config';

export class DatabaseConfig {
  private static dataSource: DataSource;

  static getDataSource(): DataSource {
    if (!DatabaseConfig.dataSource) {
      DatabaseConfig.dataSource = new DataSource({
        type: 'mysql',                    
        host: envConfig.DB_HOST,
        port: envConfig.DB_PORT,
        username: envConfig.DB_USERNAME,
        password: envConfig.DB_PASSWORD,
        database: envConfig.DB_NAME,
        
        entities: ['src/modules/**/*.entity.ts'],
        migrations: ['src/database/migrations/*.ts'],
        
        synchronize: false,
        logging: envConfig.DB_LOGGING === true,
        
        // Extra options for MySQL
        charset: 'utf8mb4',
        timezone: '+07:00',               // Change according to your timezone
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