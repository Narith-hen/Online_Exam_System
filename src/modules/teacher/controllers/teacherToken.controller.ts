import { Request, Response } from 'express';
import { TeacherTokenService } from '../services/teacherToken.service';

export class TeacherTokenController {
  private service = new TeacherTokenService();

  // GET /api/teachers/token/verify  (public)
  verifyToken = async (req: Request, res: Response) => {
    try {
      const header = req.headers.authorization;
      if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Missing Authorization header.' });
        return;
      }
      const token  = header.slice('Bearer '.length).trim();
      const result = await this.service.verifyTeacherToken(token);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Invalid token.' });
    }
  };

  // GET /api/teachers/token/my-tokens  (protected)
  getMyTokens = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getMyTokens(req.user!.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch tokens.' });
    }
  };

  // POST /api/teachers/token/logout  (protected)
  logout = async (req: Request, res: Response) => {
    try {
      const token  = req.headers.authorization!.slice('Bearer '.length).trim();
      const result = await this.service.revokeToken(token);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Logout failed.' });
    }
  };

  // POST /api/teachers/token/logout-all  (protected)
  logoutAll = async (req: Request, res: Response) => {
    try {
      const result = await this.service.revokeAllTokens(req.user!.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Logout all failed.' });
    }
  };
}