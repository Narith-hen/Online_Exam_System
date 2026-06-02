// services/student.service.ts
import { StudentRepository } from '../repositories/student.repository';
import { StudentLoginDto }   from '../dto/student-login.dto';
import { StartQuizDto }      from '../dto/start-quiz.dto';
import { SubmitQuizDto }     from '../dto/submit-quiz.dto';

export class StudentService {
  private repo: StudentRepository;

  constructor() {
    this.repo = new StudentRepository();
  }

  // services/student.service.ts
  async login(dto: StudentLoginDto) {
    const student = await this.repo.findStudentByEmail(dto.email);

    if (student) {
      throw new Error("Can't login again");
    }

    // ── new student — create only if all fields are valid ─────────────────
    const newStudent = await this.repo.createStudent({
      fullname: dto.fullname,
      class:    dto.class,
      email:    dto.email,
    });

    return newStudent;

  return student;
 }

  async startQuiz(dto: StartQuizDto) {
    const student = await this.repo.findStudentById(dto.studentId);
    if (!student) throw new Error('Student not found');

    return this.repo.createSession(dto.studentId, dto.examId);
  }

  async submitQuiz(dto: SubmitQuizDto) {
    const session = await this.repo.findSessionById(dto.examSessionId);
    if (!session)                       throw new Error('Session not found');
    if (session.status === 'submitted') throw new Error('Quiz already submitted');

    // ── get student info ───────────────────────────────────────────────────
    const student = await this.repo.findStudentById(session.studentId);
    if (!student) throw new Error('Student not found');

    await this.repo.saveAnswers(dto.examSessionId, session.studentId, dto.answers);

    const correct    = dto.answers.filter(a => a.isCorrect).length;
    const total      = dto.answers.length;
    const percentAge = (correct / total) * 100;
    const isPassed   = percentAge >= 50;
    const grade      = percentAge >= 90 ? 'A'
                     : percentAge >= 80 ? 'B'
                     : percentAge >= 70 ? 'C'
                     : percentAge >= 60 ? 'D'
                     : 'F';

    const result = await this.repo.saveResult({
      examSessionId: dto.examSessionId,
      studentId:     session.studentId,
      totalScore:    correct,
      percentAge,
      isPassed,
      grade,
    });

    await this.repo.updateSessionStatus(dto.examSessionId, 'submitted');

    // ── return result with student name ────────────────────────────────────
    return {
      resultId:      result.resultId,
      examSessionId: result.examSessionId,
      percentAge:    result.percentAge,
      totalScore:    result.totalScore,
      isPassed:      result.isPassed,
      grade:         result.grade,
      createAt:      result.createAt,
      student: {
        id:       student.id,
        fullname: student.fullname,
        class:    student.class,
        email:    student.email,
      },
    };
  }

  async getResult(examSessionId: string) {
    const result = await this.repo.findResultBySession(examSessionId);
    if (!result) throw new Error('Result not found');
    return result;
  }

  async getResultsByStudent(studentId: number) {
    return this.repo.findResultsByStudent(studentId);
  }
}