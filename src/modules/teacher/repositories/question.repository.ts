import { AppDataSource } from '../../../config/database.config';
import { QuestionEntity } from '../entities/question.entity';

export class QuestionRepository {
  private repository = AppDataSource.getRepository(QuestionEntity);

  create(data: Partial<QuestionEntity>): QuestionEntity {
    return this.repository.create(data);
  }

  async save(question: QuestionEntity): Promise<QuestionEntity> {
    return this.repository.save(question);
  }

  async saveMany(questions: QuestionEntity[]): Promise<QuestionEntity[]> {
    return this.repository.save(questions);
  }

  async findByIdAndExamId(questionId: string, examId: string): Promise<QuestionEntity | null> {
    return this.repository.findOne({
      where: { questionId, examId },
    });
  }

  async update(question: QuestionEntity, data: Partial<QuestionEntity>): Promise<QuestionEntity> {
    this.repository.merge(question, data);
    return this.repository.save(question);
  }

  async deleteByIdAndExamId(questionId: string, examId: string): Promise<boolean> {
    const result = await this.repository.delete({ questionId, examId });
    return Boolean(result.affected);
  }
}
