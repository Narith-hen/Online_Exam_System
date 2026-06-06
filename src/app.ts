import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';


import teacherRoutes from './modules/teacher/routes/teacher.routes';
import studentRoutes from './modules/student/routes/student.routes';
import dashboardRoutes from './modules/dashboard/routes/dashboard.routes';

import errorInterceptor from './shared/interceptors/error.interceptor';
import responseInterceptor from './shared/interceptors/response.interceptor';
import loggerMiddleware from './shared/middlewares/logger.middleware';

class App {
  public app: Application;

  constructor() {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeInterceptors();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet({
      contentSecurityPolicy: false,
    }));
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(loggerMiddleware);
  }

  private initializeRoutes(): void {
    this.app.get('/', (_req, res) => {
      res.json({
        message: 'Exam System API is running',
        version: '1.0.0',
        status: 'active',
      });
    });

    this.app.use('/api/teachers', teacherRoutes);
    this.app.use('/api/students', studentRoutes);
    this.app.use('/api/dashboard', dashboardRoutes);

    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeInterceptors(): void {
    this.app.use(responseInterceptor);
    this.app.use(errorInterceptor);
  }
}

export default new App().app;
