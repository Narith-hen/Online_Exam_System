import { Request, Response, NextFunction } from 'express';

export function errorInterceptor(err: any, req: Request, res: Response, next: NextFunction): void {
  const status = err?.status || 500;
  res.status(status).json({ error: err?.message || 'Internal Server Error' });
}

export default errorInterceptor;
