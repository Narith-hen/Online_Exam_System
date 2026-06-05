import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_secret_key'
    );
    (req as any).student = decoded;
    next();
  } catch (e) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token.' 
    });
  }
}