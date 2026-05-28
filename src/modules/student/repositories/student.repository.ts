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

  async findStudentById(studentId: number): Promise<Student | null> {
    return this.studentRepo
      .createQueryBuilder('student')
      .select(['student.id', 'student.fullname', 'student.class', 'student.email'])
      .where('student.id = :studentId', { studentId })
      .getOne();
  }

  async createStudent(data: Partial<Student>): Promise<Student> {
    return this.studentRepo.save(this.studentRepo.create(data));
  }

  // ── Session ───────────────────────────────────────────────────────────────

  async findSessionById(sessionId: number): Promise<ExamSession | null> {
    return this.sessionRepo
      .createQueryBuilder('session')
      .select(['session.id', 'session.status', 'session.studentId', 'session.createdAt'])
      .leftJoin('session.student', 'student')
      .addSelect(['student.id', 'student.fullname', 'student.email'])
      .where('session.id = :sessionId', { sessionId })
      .getOne();
  }

  async findActiveSession(studentId: number): Promise<ExamSession | null> {
    return this.sessionRepo
      .createQueryBuilder('session')
      .select(['session.id', 'session.status'])
      .where('session.studentId = :studentId', { studentId })
      .andWhere('session.status = :status', { status: 'in_progress' })
      .getOne();
  }

  async createSession(studentId: number): Promise<ExamSession> {
    return this.sessionRepo.save(
      this.sessionRepo.create({ studentId, status: 'in_progress' })
    );
  }

  async updateSessionStatus(sessionId: number, status: string): Promise<void> {
    await this.sessionRepo
      .createQueryBuilder()
      .update(ExamSession)
      .set({ status })
      .where('id = :sessionId', { sessionId })
      .execute();
  }

  // ── Answer ────────────────────────────────────────────────────────────────

  async saveAnswers(examSessionId: number, answers: { questionText: string; selectedOption: string }[]): Promise<void> {
    const records = answers.map(a => this.answerRepo.create({ ...a, examSessionId }));
    await this.answerRepo.save(records);
  }

  // ── Result ────────────────────────────────────────────────────────────────

  async findResultBySession(examSessionId: number): Promise<Result | null> {
    return this.resultRepo
      .createQueryBuilder('result')
      .select(['result.resultId', 'result.percentAge', 'result.totalScore', 'result.isPassed', 'result.grade', 'result.createdAt'])
      .leftJoin('result.student', 'student')
      .addSelect(['student.id', 'student.fullname', 'student.class', 'student.email'])
      .where('result.examSessionId = :examSessionId', { examSessionId })
      .getOne();
  }

  async findResultsByStudent(studentId: number): Promise<Result[]> {
    return this.resultRepo
      .createQueryBuilder('result')
      .select(['result.resultId', 'result.percentAge', 'result.totalScore', 'result.isPassed', 'result.grade', 'result.createdAt'])
      .leftJoin('result.examSession', 'examSession')
      .addSelect(['examSession.id', 'examSession.createdAt'])
      .where('result.studentId = :studentId', { studentId })
      .orderBy('result.createdAt', 'DESC')
      .getMany();
  }

  async saveResult(data: Partial<Result>): Promise<Result> {
    return this.resultRepo.save(this.resultRepo.create(data));
  }
}