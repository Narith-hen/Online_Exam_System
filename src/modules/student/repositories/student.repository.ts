import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database.config';
import { ExamSession } from '../entities/ExamSession.entity';
import { Answer } from '../entities/Answer.entity';
import { Result } from '../entities/Result.entity';

export class StudentRepository {
  private sessionRepo: Repository<ExamSession>;
  private answerRepo:  Repository<Answer>;
  private resultRepo:  Repository<Result>;

  constructor() {
    this.sessionRepo = AppDataSource.getRepository(ExamSession);
    this.answerRepo  = AppDataSource.getRepository(Answer);
    this.resultRepo  = AppDataSource.getRepository(Result);
  }

  async createSession(data: Partial<ExamSession>): Promise<ExamSession> {
    const session = this.sessionRepo.create(data);
    return this.sessionRepo.save(session);
  }

  async findSessionById(id: number): Promise<ExamSession | null> {
    return this.sessionRepo.findOne({
      where: { id },
      relations: ['exam', 'exam.questions'],
    });
  }

  async saveSession(session: ExamSession): Promise<ExamSession> {
    return this.sessionRepo.save(session);
  }

  async saveAnswer(data: Partial<Answer>): Promise<Answer> {
    const answer = this.answerRepo.create(data);
    return this.answerRepo.save(answer);
  }

  async saveResult(data: Partial<Result>): Promise<Result> {
    const result = this.resultRepo.create(data);
    return this.resultRepo.save(result);
  }
}