// services/student.service.ts
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
import { StudentLoginDto }   from '../dto/student-login.dto';
import { StartQuizDto }      from '../dto/start-quiz.dto';
import { SubmitQuizDto }     from '../dto/submit-quiz.dto';
import { QuestionEntity }    from '../../teacher/entities/question.entity';

export class StudentService {
  private repo: StudentRepository;

  constructor() {
    this.repo = new StudentRepository();
  }

  async login(dto: StudentLoginDto) {
    const student = await this.repo.findStudentByEmail(dto.email);

    if (student) {
      if (!student.isLoggedIn) {
        await this.repo.setStudentLoggedIn(student.id, true);
        student.isLoggedIn = true;
      }
      return student;
    }

    if (!dto.fullname || !dto.class) {
      throw new Error('fullname and class are required for new student registration');
    }

    const newStudent = await this.repo.createStudent({
      fullname: dto.fullname,
      class:    dto.class,
      email:    dto.email,
      isLoggedIn: true,
    });

    return newStudent;
  }

  async startQuiz(dto: StartQuizDto) {
    const student = await this.repo.findStudentById(dto.studentId);

    if (!student) {
      throw new NotFoundException(`Student ${dto.studentId} not found`);
    }
    if (!student.isLoggedIn) {
      throw new ForbiddenException('Student must be logged in before starting a quiz');
    }

    const existingSession = await this.repo.findSessionByStudentId(dto.studentId);
    if (existingSession) {
      throw new ConflictException('Student ID cannot be reused. Each student can only start the quiz once.');
    }

    return await this.repo.createSession(dto.studentId, dto.examId);
  }

  async submitQuiz(dto: SubmitQuizDto) {
    const session = await this.repo.findSessionById(dto.examSessionId);
    if (!session) throw new Error('Session not found');
    if (session.status === 'submitted') throw new Error('Quiz already submitted');

    const student = await this.repo.findStudentById(session.studentId);
    if (!student) throw new Error('Student not found');

    const questions = await this.repo.findQuestionsByExamId(session.examId);
    if (!questions || questions.length === 0) throw new Error('Exam questions not found');

    // isCorrect and answerText kept internally for grading only
    const gradedAnswers = dto.answers.map(answer => {
      const question = questions.find(q => q.questionId === answer.questionId);
      if (!question) {
        throw new Error(`Question ${answer.questionId} not found in exam`);
      }

      const studentAnswer = answer.studentAnswer ?? '';
      const optionId = (answer as any).optionId;
      const isCorrect = this.compareAnswer(studentAnswer, optionId, question);
      const answerText = question.correctAnswer;

      return {
        questionId: answer.questionId,
        studentAnswer,
        isCorrect,
        answerText,
      };
    });

    const correct = gradedAnswers.filter((ans) => ans.isCorrect).length;
    const total = gradedAnswers.length;
    const percentAge = total === 0 ? 0 : (correct / total) * 100;
    const isPassed = percentAge >= 50;
    const grade = percentAge >= 90 ? 'A'
                : percentAge >= 80 ? 'B'
                : percentAge >= 70 ? 'C'
                : percentAge >= 60 ? 'D'
                : 'F';

    await this.repo.saveAnswers(dto.examSessionId, session.studentId, gradedAnswers);

    const result = await this.repo.saveResult({
      examSessionId: dto.examSessionId,
      studentId:     session.studentId,
      totalScore:    correct,
      percentAge,
      isPassed,
      grade,
    });

    await this.repo.updateSessionStatus(dto.examSessionId, 'submitted');

    // ✅ isCorrect, answerText, gradedAnswers removed from response
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

  private compareAnswer(studentAnswer: string, optionId: string | undefined, question: QuestionEntity): boolean {
    const normalize = (text: string) => text.trim().toLowerCase();
    const normalizedStudent = normalize(studentAnswer);
    const normalizedCorrect = normalize(question.correctAnswer || '');

    if (optionId) {
      if (normalize(optionId) === normalizedCorrect) {
        return true;
      }
    }

    return normalizedStudent === normalizedCorrect;
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