import { Request, Response } from "express";
import { AuthService } from "../services/teacher.service";
import { RegisterService } from "../services/register.service";
import { ResultStudentService } from "../services/resultStudent.service";

export class AuthController {
    private authService = new AuthService();
    private registerService = new RegisterService();
    private resultStudentService = new ResultStudentService();

    // Teacher Login
    teacherLogin = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.teacherLogin(req.body);

            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message || 'Login failed' });
        }
    };

    // Teacher Register
    teacherRegister = async (req: Request, res: Response) => {
        try {
            const result = await this.registerService.teacherRegister(req.body);

            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Register failed' });
        }
    };

    // Get result student
    teacherShowResult = async (req: Request, res: Response) => {
        try {
            const results = await this.resultStudentService.getAllStudentResults();

            res.status(200).json({
                message: "Student results fetched successfully",
                data: results,
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to fetch student results' });
        }
    };

    // Get all teachers
    teacherGetAll = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.getAllTeachers();
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to fetch teachers' });
        }
    };
}
