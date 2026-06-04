// repositories/student.repository.ts
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common'; // ✅ add this
import { AppDataSource } from '../../../config/database.config';
import { Student }        from '../entities/student.entity';
import { ExamSession }    from '../entities/ExamSession.entity';
import { Answer }         from '../entities/answer.entity';
import { Result }         from '../entities/result.entity';
import { QuestionEntity } from '../../teacher/entities/question.entity';

export class StudentRepository {
  private studentRepo:  Repository<Student>;
  private sessionRepo:  Repository<ExamSession>;
  private answerRepo:   Repository<Answer>;
  private resultRepo:   Repository<Result>;
  private questionRepo: Repository<QuestionEntity>;

  constructor() {
    this.studentRepo  = AppDataSource.getRepository(Student);
    this.sessionRepo  = AppDataSource.getRepository(ExamSession);
    this.answerRepo   = AppDataSource.getRepository(Answer);
    this.resultRepo   = AppDataSource.getRepository(Result);
    this.questionRepo = AppDataSource.getRepository(QuestionEntity);
  }

  // ── LOGIN ─────────────────────────────────────────────────────────────────

  async findStudentByEmail(email: string): Promise<Student | null> {
    return this.studentRepo
      .createQueryBuilder('student')
      .select(['student.id', 'student.fullname', 'student.class', 'student.email', 'student.isLoggedIn'])
      .where('student.email = :email', { email })
      .getOne();
  }

  async findStudentById(id: number): Promise<Student | null> {
    return this.studentRepo
      .createQueryBuilder('student')
      .select(['student.id', 'student.fullname', 'student.class', 'student.email', 'student.isLoggedIn'])
      .where('student.id = :id', { id })
      .getOne();
  }

  async setStudentLoggedIn(studentId: number, loggedIn: boolean): Promise<void> {
    await this.studentRepo
      .createQueryBuilder()
      .update(Student)
      .set({ isLoggedIn: loggedIn })
      .where('id = :studentId', { studentId })
      .execute();
  }

  async createStudent(data: Partial<Student>): Promise<Student> {
    return this.studentRepo.save(this.studentRepo.create(data));
  }

  // ── START QUIZ ────────────────────────────────────────────────────────────

  // Only ONE createSession method
  async createSession(studentId: number, examId: string): Promise<ExamSession> {
    // Check if student already has a session
    const existingSession = await this.findSessionByStudentId(studentId);
    if (existingSession) {
      throw new ConflictException(
        `Student ${studentId} has already started a quiz. Each student can only start once.`
      );
    }

    try {
      return await this.sessionRepo.save(
        this.sessionRepo.create({
          studentId,
          examId,
          status:    'in_progress',
          startedAt: new Date(),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        })
      );
    } catch (error:any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          `Student ${studentId} has already started a quiz. Each student can only start once.`
        );
      }
      throw error;
    }
  }

  async findSessionById(examSessionId: string): Promise<ExamSession | null> {
    return this.sessionRepo
      .createQueryBuilder('session')
      .select([
        'session.examSessionId',
        'session.status',
        'session.studentId',
        'session.examId',
        'session.startedAt',
        'session.expiresAt',
      ])
      .where('session.examSessionId = :examSessionId', { examSessionId })
      .getOne();
  }

  async findSessionByStudentId(studentId: number): Promise<ExamSession | null> {
    return this.sessionRepo
      .createQueryBuilder('session')
      .select(['session.examSessionId', 'session.status', 'session.examId'])
      .where('session.studentId = :studentId', { studentId })
      .getOne();
  }

  // ── SUBMIT QUIZ ───────────────────────────────────────────────────────────

  async saveAnswers(
    examSessionId: string,
    studentId: number,
    answers: { questionId: string; studentAnswer: string; isCorrect: boolean; answerText: string }[]
  ): Promise<void> {
    const records = answers.map(a =>
      this.answerRepo.create({ ...a, examSessionId, studentId })
    );
    await this.answerRepo.save(records);
  }

  async saveResult(data: Partial<Result>): Promise<Result> {
    return this.resultRepo.save(this.resultRepo.create(data));
  }

  async findQuestionsByExamId(examId: string): Promise<QuestionEntity[]> {
    return this.questionRepo.find({ where: { examId } });
  }

  async updateSessionStatus(examSessionId: string, status: string): Promise<void> {
    await this.sessionRepo
      .createQueryBuilder()
      .update(ExamSession)
      .set({ status, submittedAt: new Date() })
      .where('examSessionId = :examSessionId', { examSessionId })
      .execute();
  }

  // ── GET RESULTS ───────────────────────────────────────────────────────────

  async findResultBySession(examSessionId: string): Promise<Result | null> {
    return this.resultRepo
      .createQueryBuilder('result')
      .select([
        'result.resultId',
        'result.percentAge',
        'result.totalScore',
        'result.isPassed',
        'result.grade',
        'result.createAt',
      ])
      .leftJoin('result.student', 'student')
      .addSelect(['student.id', 'student.fullname', 'student.class', 'student.email'])
      .where('result.examSessionId = :examSessionId', { examSessionId })
      .getOne();
  }

  async findResultsByStudent(studentId: number): Promise<Result[]> {
    return this.resultRepo
      .createQueryBuilder('result')
      .select([
        'result.resultId',
        'result.percentAge',
        'result.totalScore',
        'result.isPassed',
        'result.grade',
        'result.createAt',
      ])
      .leftJoin('result.student', 'student')
      .addSelect(['student.id', 'student.fullname', 'student.class', 'student.email'])
      .where('result.studentId = :studentId', { studentId })
      .orderBy('result.createAt', 'DESC')
      .getMany();
  }

  async findAll() {
    return this.studentRepo.find({
      order: { id: 'ASC' }
    });
  }

  async deleteSessionsByExamId(examId: string): Promise<void> {
    const sessions = await this.sessionRepo
      .createQueryBuilder('session')
      .select(['session.examSessionId'])
      .where('session.examId = :examId', { examId })
      .getRawMany();

    const sessionIds = sessions.map((s: any) => s.session_examSessionId || s.examSessionId);
    if (sessionIds.length === 0) return;

    await this.answerRepo
      .createQueryBuilder()
      .delete()
      .where('examSessionId IN (:...ids)', { ids: sessionIds })
      .execute();

    await this.resultRepo
      .createQueryBuilder()
      .delete()
      .where('examSessionId IN (:...ids)', { ids: sessionIds })
      .execute();

    await this.sessionRepo
      .createQueryBuilder()
      .delete()
      .where('examId = :examId', { examId })
      .execute();
  }
}