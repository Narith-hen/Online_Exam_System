import express, { Application } from 'express';
// import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import authRoutes from './modules/teacher/routes/teacher.routes';
import teacherRoutes from './modules/teacher/routes/teacher.routes';
// import authRoutes from './modules/auth/routes/auth.routes';
import teacherExamRoutes from './modules/teacher/routes/teacherExam.routes';
import studentRoutes from './modules/student/routes/student.routes';
import dashboardRoutes from './modules/dashboard/routes/dashboard.routes';

import errorInterceptor from './shared/interceptors/error.interceptor';
import responseInterceptor from './shared/interceptors/response.interceptor';
import loggerMiddleware from './shared/middlewares/logger.middleware';

const app = express();

class App {
  public app: Application;

  constructor() {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeInterceptors();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(loggerMiddleware);
  }

  private initializeRoutes(): void {
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Exam System API is running',
        version: '1.0.0',
        status: 'active',
      });
    });

    this.app.use('/api/teachers', teacherRoutes);
    this.app.use('/api/students', studentRoutes);
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/teachers/exams', teacherExamRoutes);


    this.app.get('/health', (req, res) => {
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