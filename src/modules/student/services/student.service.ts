import { StudentRepository } from '../repositories/student.repository';
import { StudentLoginDto }   from '../dto/student-login.dto';
import { StartQuizDto }      from '../dto/start-quiz.dto';
import { SubmitQuizDto }     from '../dto/submit-quiz.dto';
import { Student }           from '../entities/student.entity';

export class StudentService {
  private repo: StudentRepository;

  constructor() {
    this.repo = new StudentRepository();
  }

  async login(dto: StudentLoginDto): Promise<Student> {
    // Return type is Student — guarantees id is always present
    const existing = await this.repo.findStudentByEmail(dto.email);

    if (existing) {
      return existing;
    }

    // New student — created and returned with DB-generated id
    const newStudent = await this.repo.createStudent({
      fullname: dto.fullname,
      class:    dto.class,
      email:    dto.email,
    });

    return newStudent;
  }

  async startQuiz(dto: StartQuizDto) {
    const student = await this.repo.findStudentById(dto.studentId);
    if (!student) throw new Error('Student not found');

    // Guard: prevent duplicate active sessions for same exam
    return this.repo.createSession(dto.studentId, dto.examId);
  }

  async submitQuiz(dto: SubmitQuizDto) {
    const session = await this.repo.findSessionById(dto.examSessionId);
    if (!session)
      throw new Error('Session not found');
    if (session.status === 'submitted')
      throw new Error('Quiz already submitted');

    const student = await this.repo.findStudentById(session.studentId);
    if (!student) throw new Error('Student not found');

    // Fetch all questions and calculate correct/incorrect
    const questionsMap = await this.repo.getQuestionsByExamId(session.examId);
    
    const answersWithCorrectFlag = dto.answers.map(a => {
      const question = questionsMap.get(a.questionId);
      if (!question) {
        throw new Error(`Question ${a.questionId} not found`);
      }

      const isCorrect = a.studentAnswer.toLowerCase().trim() === 
                       question.correctAnswer.toLowerCase().trim();

      return {
        questionId:    a.questionId,
        studentAnswer: a.studentAnswer,
        isCorrect,
        answerText:    question.correctAnswer,
      };
    });

    await this.repo.saveAnswers(dto.examSessionId, session.studentId, answersWithCorrectFlag);

    const correct    = answersWithCorrectFlag.filter(a => a.isCorrect).length;
    const total      = answersWithCorrectFlag.length;
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