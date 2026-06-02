import { AppDataSource } from '../../../config/database.config';
import { ExamEntity } from '../entities/exam.entity';
import { QuestionEntity } from '../entities/question.entity';

export class ExamRepository {
  private repository = AppDataSource.getRepository(ExamEntity);

  async findAllWithQuestions(): Promise<ExamEntity[]> {
    return this.repository.find({
      relations: { questions: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByIdWithQuestions(examId: string): Promise<ExamEntity | null> {
    return this.repository.findOne({
      where: { examId },
      relations: { questions: true },
    });
  }

  async findById(examId: string): Promise<ExamEntity | null> {
    return this.repository.findOne({ where: { examId } });
  }

  create(data: Partial<ExamEntity>): ExamEntity {
    return this.repository.create(data);
  }

  async save(exam: ExamEntity): Promise<ExamEntity> {
    return this.repository.save(exam);
  }

  async update(exam: ExamEntity, data: Partial<ExamEntity>): Promise<ExamEntity> {
    this.repository.merge(exam, data);
    return this.repository.save(exam);
  }

  async deleteWithQuestions(examId: string): Promise<boolean> {
    const queryRunner = AppDataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const exam = await queryRunner.manager.findOne(ExamEntity, { where: { examId } });
      if (!exam) {
        await queryRunner.rollbackTransaction();
        return false;
      }

      await queryRunner.manager.delete(QuestionEntity, { examId });
      const result = await queryRunner.manager.delete(ExamEntity, { examId });

      if (!result.affected) {
        await queryRunner.rollbackTransaction();
        return false;
      }

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }
}
