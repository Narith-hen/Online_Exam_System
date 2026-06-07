import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Missing or invalid Authorization header.' });
      return;
    }

    const token   = header.slice('Bearer '.length).trim();
    const payload = verifyToken(token);

    const id = String(payload.id ?? '');
    if (!id) {
      res.status(401).json({ success: false, message: 'Invalid token payload.' });
      return;
    }

    req.user = {
      id,
      email : typeof payload.email === 'string' ? payload.email : undefined,
      role  : typeof payload.role  === 'string' ? payload.role  : undefined,
    };

    next();
  } catch (error: any) {
    const isExpired = error?.message === 'jwt expired';
    res.status(401).json({
      success: false,
      message: isExpired ? 'Token has expired. Please log in again.' : 'Invalid token.',
    });
  }
}