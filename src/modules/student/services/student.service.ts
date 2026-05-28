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

  async login(dto: StudentLoginDto) {
    let student = await this.repo.findStudentByEmail(dto.email);
    if (!student) {
      student = await this.repo.createStudent({
        fullname: dto.fullname,
        class:    dto.class,
        email:    dto.email,
      });
    }
    return student;
  }

// services/student.service.ts
async startQuiz(dto: StartQuizDto) {
  const student = await this.repo.findStudentById(dto.studentId);
  if (!student) throw new Error('Student not found');

  // ← remove active session check, always create new session
  return this.repo.createSession(dto.studentId, dto.examId);
}

  async submitQuiz(dto: SubmitQuizDto) {
    const session = await this.repo.findSessionById(dto.examSessionId);
    if (!session)                       throw new Error('Session not found');
    if (session.status === 'submitted') throw new Error('Quiz already submitted');

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
    return result;
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