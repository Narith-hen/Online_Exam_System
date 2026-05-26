import { Request, Response } from 'express';
import { StudentService } from '../services/student.service';
import { StudentStartDto } from '../dto/student-start.dto';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';

export class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
    this.startQuiz  = this.startQuiz.bind(this);
    this.submitQuiz = this.submitQuiz.bind(this);
  }

  async startQuiz(req: Request, res: Response): Promise<void> {
    try {
      const dto    = new StudentStartDto(req.body);
      const result = await this.studentService.startQuiz(dto);
      res.status(200).json({ message: 'Quiz started successfully', data: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async submitQuiz(req: Request, res: Response): Promise<void> {
    try {
      const dto    = new SubmitQuizDto(req.body);
      const result = await this.studentService.submitQuiz(dto);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}