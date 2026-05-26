import { Request, Response } from "express";
import { AuthService } from "../services/teacher.service";

export class AuthController {
    private authService = new AuthService();

    teacherLogin = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.teacherLogin(req.body);

            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message || 'Login failed' });
        }
    };
}