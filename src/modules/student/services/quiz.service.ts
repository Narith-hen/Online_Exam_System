import { QuizRepository } from '../repositories/quiz.repository';
import { Exam } from '../entities/Exam.entity';

export class QuizService {
  private quizRepository: QuizRepository;

  constructor() {
    this.quizRepository = new QuizRepository();
  }

  async createQuiz(data: { title: string; description?: string }): Promise<Exam> {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return this.quizRepository.create({
      title: data.title,
      description: data.description,
      code,
      isActive: true,
    });
  }

  async getAllQuizzes(): Promise<Exam[]> {
    return this.quizRepository.findAllActive();
  }
}