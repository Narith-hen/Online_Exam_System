// services/student.service.ts
import { StudentRepository } from '../repositories/student.repository';
import { StudentLoginDto }   from '../dto/student-login.dto';
import { StartQuizDto }      from '../dto/start-quiz.dto';
import { SubmitQuizDto }     from '../dto/submit-quiz.dto';
import { QuestionType }      from '../../../constants/question-type.enum';
import { QuestionEntity }    from '../../teacher/entities/question.entity';

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

    // ── fetch all questions for this exam ──────────────────────────────────
    const questions = await this.repo.findQuestionsByExamId(session.examId);
    if (questions.length === 0) throw new Error('Exam not found or has no questions');

    // ── grade all student answers ──────────────────────────────────────────
    const gradedAnswers: Array<{
      questionId: string;
      studentAnswer: string;
      optionId?: string;
      isCorrect: boolean;
      answerText: string;
    }> = [];

    let correctCount = 0;

    for (const answer of dto.answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) {
        throw new Error(`Question ${answer.questionId} not found in exam`);
      }

      const optionId = (answer as any).optionId;

      const { isCorrect, correctAnswerText, selectedOptionText } = this.checkAnswer(
        answer.studentAnswer,
        question,
        optionId
      );

      gradedAnswers.push({
        questionId: answer.questionId,
        studentAnswer: selectedOptionText ?? (answer.studentAnswer ?? ''),
        optionId: optionId !== undefined ? String(optionId) : undefined,
        isCorrect,
        answerText: correctAnswerText,
      });

      if (isCorrect) correctCount++;
    }

    // ── save the graded answers ────────────────────────────────────────────
    await this.repo.saveAnswers(
      dto.examSessionId,
      session.studentId,
      gradedAnswers
    );

    // ── calculate score ───────────────────────────────────────────────────
    const total = gradedAnswers.length;
    const percentAge = (correctCount / total) * 100;
    const isPassed = percentAge >= 50;
    const grade = percentAge >= 90 ? 'A'
                : percentAge >= 80 ? 'B'
                : percentAge >= 70 ? 'C'
                : percentAge >= 60 ? 'D'
                : 'F';

    const result = await this.repo.saveResult({
      examSessionId: dto.examSessionId,
      studentId:     session.studentId,
      totalScore:    correctCount,
      percentAge,
      isPassed,
      grade,
    });

    await this.repo.updateSessionStatus(dto.examSessionId, 'submitted');

    // ── return result with student name and graded answers ────────────────
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
      gradedAnswers: gradedAnswers.map(a => ({
        questionId: a.questionId,
        studentAnswer: a.studentAnswer,
        isCorrect: a.isCorrect,
        correctAnswer: a.answerText,
      })),
    };
  }

  // ── HELPER METHODS ────────────────────────────────────────────────────────

  private checkAnswer(
    studentAnswer: string | undefined,
    question: QuestionEntity,
    optionId?: string
  ): { isCorrect: boolean; correctAnswerText: string; selectedOptionText?: string } {
    const normalizeAnswer = (answer: string): string => {
      return answer.trim().toLowerCase();
    };

    const studentAns = normalizeAnswer(String(studentAnswer || ''));

    switch (question.type) {
      case QuestionType.TRUE_FALSE:
        // For true/false, compare with correctAnswer field
        const correctBoolean = normalizeAnswer(question.correctAnswer || '');
        const isCorrect = studentAns === correctBoolean;
        return {
          isCorrect,
          correctAnswerText: question.correctAnswer || '',
        };

      case QuestionType.MULTIPLE_CHOICE:
        // For multiple choice, prefer optionId if provided, otherwise match by text
        if (!question.options || question.options.length === 0) {
          throw new Error(`No options found for multiple choice question ${question.id}`);
        }

        let selectedOption = undefined as any;

        if (optionId) {
          selectedOption = question.options.find(opt => String(opt.id) === String(optionId));
        } else {
          selectedOption = question.options.find(opt => normalizeAnswer(opt.text) === studentAns);
        }

        const correctOption = question.options.find(opt => opt.isCorrect);

        if (!selectedOption) {
          return {
            isCorrect: false,
            correctAnswerText: correctOption?.text || 'No correct answer set',
            selectedOptionText: undefined,
          };
        }

        return {
          isCorrect: !!selectedOption.isCorrect,
          correctAnswerText: correctOption?.text || 'No correct answer set',
          selectedOptionText: selectedOption.text,
        };

      case QuestionType.SHORT_ANSWER:
        // For short answers, compare with correctAnswer field
        const correctAnswer = normalizeAnswer(question.correctAnswer || '');
        const answerCorrect = studentAns === correctAnswer;
        return {
          isCorrect: answerCorrect,
          correctAnswerText: question.correctAnswer || '',
        };

      default:
        throw new Error(`Unknown question type: ${question.type}`);
    }
  }

  async getResult(examSessionId: string) {
    const result = await this.repo.findResultBySession(examSessionId);
    if (!result) throw new Error('Result not found');
    return result;
  }

  async getResultsByStudent(studentId: number) {
    return this.repo.findResultsByStudent(studentId);
  }

  async getQuestions(examId: string) {
    const questions = await this.repo.findQuestionsByExamId(examId);
    // Return questions but hide correct answers / isCorrect flags
    return questions.map(q => ({
      id: q.id,
      examId: q.examId,
      text: q.text,
      type: q.type,
      points: q.points,
      options: (q.options || []).map(o => ({ id: o.id, text: o.text })),
    }));
  }
}