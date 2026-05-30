import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      req.user = undefined;
      return next();
    }

    const token = header.slice('Bearer '.length).trim();
    const payload = verifyToken(token);

    const id = String(payload.id ?? '');
    if (!id) {
      req.user = undefined;
      return next();
    }

    req.user = {
      id,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      role: typeof payload.role === 'string' ? payload.role : undefined,
    };
    next();
  } catch {
    req.user = undefined;
    next();
  }
}

