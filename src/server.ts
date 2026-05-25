import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { envConfig } from './config/env.config';
import { DatabaseConfig } from './config/database.config';

import authRoutes from './modules/auth/routes/auth.routes';
import teacherRoutes from './modules/teacher/routes/teacher.routes';
import studentRoutes from './modules/student/routes/student.routes';
import dashboardRoutes from './modules/dashboard/routes/dashboard.routes';

import errorInterceptor from './shared/interceptors/error.interceptor';
import responseInterceptor from './shared/interceptors/response.interceptor';
import loggerMiddleware from './shared/middlewares/logger.middleware';

class App {
  public app: Application;
  public port: number;

  constructor() {
    this.app = express();
    this.port = envConfig.PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeInterceptors();
    // Skip database initialization during tests
    if (envConfig.NODE_ENV !== 'test') {
      this.initializeDatabase();
    }
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Custom logger
    this.app.use(loggerMiddleware);
  }

  private initializeRoutes(): void {
    // API Base Route
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Exam System API is running',
        version: '1.0.0',
        status: 'active'
      });
    });

    // Module Routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/teacher', teacherRoutes);
    this.app.use('/api/student', studentRoutes);
    this.app.use('/api/dashboard', dashboardRoutes);

    // Health Check
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
    });
  }

  private initializeInterceptors(): void {
    // Response formatter
    this.app.use(responseInterceptor);
    
    // Global error handler (must be last)
    this.app.use(errorInterceptor);
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await DatabaseConfig.connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on http://localhost:${this.port}`);
    //   console.log(`📡 Environment: ${envConfig.NODE_ENV}`);
    });
  }
}

// Create the application but only auto-listen outside of test environment
const application = new App();
if (envConfig.NODE_ENV !== 'test') {
  application.listen();
}

export default application.app;