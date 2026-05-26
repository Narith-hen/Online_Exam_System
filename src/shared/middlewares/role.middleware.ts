import { Request, Response, NextFunction } from 'express';

export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }
    next();
  };
}

