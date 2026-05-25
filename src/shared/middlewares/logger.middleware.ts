import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

export default loggerMiddleware;
