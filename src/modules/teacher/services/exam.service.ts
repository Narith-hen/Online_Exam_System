import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ExamEntity } from '../entities/exam.entity';
import { QuestionEntity } from '../entities/question.entity';
import { CreateExamDto } from '../dto/exam.dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamEntity)
    private readonly examRepo: Repository<ExamEntity>,

    @InjectRepository(QuestionEntity)
    private readonly questionRepo: Repository<QuestionEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async createExam(dto: CreateExamDto, teacherId: string): Promise<ExamEntity> {
    // Validate at least one question is provided
    if (!dto.questions || dto.questions.length === 0) {
      throw new BadRequestException('An exam must have at least one question.');
    }

    // Validate date window
    const start = new Date(dto.startWindow);
    const end = new Date(dto.endWindow);
    if (end <= start) {
      throw new BadRequestException('endWindow must be after startWindow.');
    }

    // Calculate totalMarks from questions
    const totalMarks = dto.questions.reduce((sum, q) => sum + q.marks, 0);

    // Validate passingScore does not exceed totalMarks
    if (dto.passingScore > totalMarks) {
      throw new BadRequestException(
        `passingScore (${dto.passingScore}) cannot exceed totalMarks (${totalMarks}).`,
      );
    }

    // Use a transaction so exam + questions are created atomically
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the exam
      const exam = Object.assign(new ExamEntity(), {
        examId: uuidv4(),
        createdBy: teacherId,
        title: dto.title,
        description: dto.description ?? null,
        durationMinutes: dto.durationMinutes,
        startWindow: start,
        endWindow: end,
        totalMarks,
        passingScore: dto.passingScore,
        isPublished: dto.isPublished ?? false,
        examCode: dto.examCode ?? null,
        examLink: dto.examLink ?? null,
      });

      const savedExam = await queryRunner.manager.save(ExamEntity, exam);

      // Create all questions linked to this exam
      const questions = dto.questions.map((q) =>
        Object.assign(new QuestionEntity(), {
          questionId: uuidv4(),
          examId: savedExam.examId,
          questionText: q.questionText,
          questionType: q.questionType,
          questionOptions: q.questionOptions ?? null,
          correctAnswer: q.correctAnswer,
          marks: q.marks,
        }),
      );

      await queryRunner.manager.save(QuestionEntity, questions);

      await queryRunner.commitTransaction();

      // Return exam with questions attached
      return { ...savedExam, questions };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getExamsByTeacher(teacherId: string): Promise<ExamEntity[]> {
    return this.examRepo.find({
      where: { createdBy: teacherId },
      relations: { questions: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getExamById(examId: string, teacherId: string): Promise<ExamEntity> {
    const exam = await this.examRepo.findOne({
      where: { examId },
      relations: { questions: true },
    });

    if (!exam) {
      throw new BadRequestException('Exam not found.');
    }

    if (exam.createdBy !== teacherId) {
      throw new ForbiddenException('You do not have access to this exam.');
    }

    return exam;
  }
}
