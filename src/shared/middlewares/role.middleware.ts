import { Request, Response, NextFunction } from 'express';
 
export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role;
 
    if (!role) {
      res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
      return;
    }
 
    if (!allowedRoles.includes(role)) {
      res.status(403).json({ success: false, message: 'Forbidden. Insufficient permissions.' });
      return;
    }
 
    next();
  };
}
 