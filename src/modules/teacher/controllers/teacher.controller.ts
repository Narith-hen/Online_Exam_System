import { Request, Response } from "express";
import { AuthService } from "../services/teacher.service";
import { RegisterService } from "../services/register.service";

export class AuthController {
    private authService = new AuthService();
    private registerService = new RegisterService();

    teacherLogin = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.teacherLogin(req.body);

            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message || 'Login failed' });
        }
    };

    teacherRegister = async (req: Request, res: Response) => {
        try {
            const result = await this.registerService.teacherRegister(req.body);

            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Register failed' });
        }
    };
}
