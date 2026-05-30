import { Request, Response } from 'express';
import { StudentService }    from '../services/student.service';
import { StudentLoginDto }   from '../dto/student-login.dto';
import { StartQuizDto }      from '../dto/start-quiz.dto';
import { SubmitQuizDto }     from '../dto/submit-quiz.dto';

export class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
    this.login          = this.login.bind(this);
    this.startQuiz      = this.startQuiz.bind(this);
    this.submitQuiz     = this.submitQuiz.bind(this);
    this.getResult      = this.getResult.bind(this);
    this.getMyResults   = this.getMyResults.bind(this);
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.studentService.login(new StudentLoginDto(req.body));
      res.status(200).json({ success: true, message: 'Student login successfully', data: result });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async startQuiz(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.studentService.startQuiz(new StartQuizDto(req.body));
      res.status(201).json({ success: true, message: 'Quiz started successfully', data: result });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async submitQuiz(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.studentService.submitQuiz(new SubmitQuizDto(req.body));
      res.status(200).json({ success: true, message: 'Quiz submitted successfully', data: result });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async getResult(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.studentService.getResult(String(req.params.examSessionId));
      res.status(200).json({ success: true, data: result });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async getMyResults(req: Request, res: Response): Promise<void> {
    try {
      const results = await this.studentService.getResultsByStudent(Number(req.params.studentId));
      res.status(200).json({ success: true, data: results });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
}