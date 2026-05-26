import { Request, Response } from 'express';
import { QuizService } from '../services/quiz.service';

export class QuizController {
  private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService();
    this.create  = this.create.bind(this);
    this.getAll  = this.getAll.bind(this);
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const quiz = await this.quizService.createQuiz(req.body);
      res.status(201).json({ message: 'Quiz created successfully', data: quiz });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const quizzes = await this.quizService.getAllQuizzes();
      res.status(200).json({ data: quizzes });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}