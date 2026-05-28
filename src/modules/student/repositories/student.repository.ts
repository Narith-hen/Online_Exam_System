// repositories/student.repository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database.config';
import { Student }     from '../entities/student.entity';
import { ExamSession } from '../entities/ExamSession.entity';
import { Answer }      from '../entities/Answer.entity';
import { Result }      from '../entities/Result.entity';

export class StudentRepository {
  private studentRepo: Repository<Student>;
  private sessionRepo: Repository<ExamSession>;
  private answerRepo:  Repository<Answer>;
  private resultRepo:  Repository<Result>;

  constructor() {
    this.studentRepo = AppDataSource.getRepository(Student);
    this.sessionRepo = AppDataSource.getRepository(ExamSession);
    this.answerRepo  = AppDataSource.getRepository(Answer);
    this.resultRepo  = AppDataSource.getRepository(Result);
  }

  // ── Student ───────────────────────────────────────────────────────────────

  async findStudentByEmail(email: string): Promise<Student | null> {
    return this.studentRepo
      .createQueryBuilder('student')
      .select(['student.id', 'student.fullname', 'student.class', 'student.email'])
      .where('student.email = :email', { email })
      .getOne();
  }

  async findStudentById(id: number): Promise<Student | null> {
    return this.studentRepo
      .createQueryBuilder('student')
      .select(['student.id', 'student.fullname', 'student.class', 'student.email'])
      .where('student.id = :id', { id })
      .getOne();
  }

  async createStudent(data: Partial<Student>): Promise<Student> {
    return this.studentRepo.save(this.studentRepo.create(data));
  }

  // ── Session ───────────────────────────────────────────────────────────────

  async findSessionById(examSessionId: string): Promise<ExamSession | null> {
    return this.sessionRepo
      .createQueryBuilder('session')
      .select(['session.examSessionId', 'session.status', 'session.studentId', 'session.startedAt'])
      .where('session.examSessionId = :examSessionId', { examSessionId })
      .getOne();
  }

  async findActiveSession(studentId: number): Promise<ExamSession | null> {
    return this.sessionRepo
      .createQueryBuilder('session')
      .select(['session.examSessionId', 'session.status'])
      .where('session.studentId = :studentId', { studentId })
      .andWhere('session.status = :status', { status: 'in_progress' })
      .getOne();
  }

  async createSession(studentId: number, examId: string): Promise<ExamSession> {
  return this.sessionRepo.save(
    this.sessionRepo.create({
      studentId,
      examId,
      status:    'in_progress',
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
    })
  );
}

  async updateSessionStatus(examSessionId: string, status: string): Promise<void> {
    await this.sessionRepo
      .createQueryBuilder()
      .update(ExamSession)
      .set({ status, submittedAt: new Date() })
      .where('examSessionId = :examSessionId', { examSessionId })
      .execute();
  }

  // ── Answer ────────────────────────────────────────────────────────────────

  async saveAnswers(
    examSessionId: string,
    studentId: number,
    answers: { questionId: string; studentAnswer: string; isCorrect: boolean; answerText: string }[]
  ): Promise<void> {
    const records = answers.map(a => this.answerRepo.create({ ...a, examSessionId, studentId }));
    await this.answerRepo.save(records);
  }

  // ── Result ────────────────────────────────────────────────────────────────

  async findResultBySession(examSessionId: string): Promise<Result | null> {
    return this.resultRepo
      .createQueryBuilder('result')
      .select(['result.resultId', 'result.percentAge', 'result.totalScore', 'result.isPassed', 'result.grade', 'result.createAt'])
      .leftJoin('result.student', 'student')
      .addSelect(['student.id', 'student.fullname', 'student.class', 'student.email'])
      .where('result.examSessionId = :examSessionId', { examSessionId })
      .getOne();
  }

  async findResultsByStudent(studentId: number): Promise<Result[]> {
    return this.resultRepo
      .createQueryBuilder('result')
      .select(['result.resultId', 'result.percentAge', 'result.totalScore', 'result.isPassed', 'result.grade', 'result.createAt'])
      .where('result.studentId = :studentId', { studentId })
      .orderBy('result.createAt', 'DESC')
      .getMany();
  }

  async saveResult(data: Partial<Result>): Promise<Result> {
    return this.resultRepo.save(this.resultRepo.create(data));
  }
}