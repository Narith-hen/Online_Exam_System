import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database.config';
import { Exam } from '../entities/Exam.entity';

export class QuizRepository {
  private repo: Repository<Exam>;

  constructor() {
    this.repo = AppDataSource.getRepository(Exam);
  }

  async findAllActive(): Promise<Exam[]> {
    return this.repo.find({
      where: { isActive: true },
      relations: ['questions'],
      order: { createdAt: 'DESC' },
    });
  }

  async findLatestActive(): Promise<Exam | null> {
    return this.repo.findOne({
      where: { isActive: true },
      relations: ['questions'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<Exam>): Promise<Exam> {
    const exam = this.repo.create(data);
    return this.repo.save(exam);
  }
}