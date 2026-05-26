import { QuizRepository } from '../repositories/quiz.repository';
import { StudentRepository } from '../repositories/student.repository';
import { SessionStatus } from '../entities/ExamSession.entity';
import { StudentStartDto } from '../dto/student-start.dto';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';

export class StudentService {
  private quizRepository:    QuizRepository;
  private studentRepository: StudentRepository;

  constructor() {
    this.quizRepository    = new QuizRepository();
    this.studentRepository = new StudentRepository();
  }

  // ── Start Quiz ──────────────────────────────────────────────
  async startQuiz(data: StudentStartDto): Promise<object> {

    // 1. Validate
    data.validate();

    // 2. Get latest active exam automatically
    const exam = await this.quizRepository.findLatestActive();
    if (!exam) throw new Error('No active quiz available right now');

    // 3. Create session
    const session = await this.studentRepository.createSession({
      fullname:  data.fullname,
      email:     data.email,
      exam:      exam,
      status:    SessionStatus.IN_PROGRESS,
      startedAt: new Date(),
    });

    // 4. Return questions without correct answers
    const questions = exam.questions.map((q) => ({
      id:      q.id,
      text:    q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
    }));

    return {
      sessionId:      session.id,
      examTitle:      exam.title,
      totalQuestions: questions.length,
      questions,
    };
  }

  // ── Submit Quiz (just save answers, no scoring) ─────────────
  async submitQuiz(data: SubmitQuizDto): Promise<object> {

    // 1. Validate
    data.validate();

    // 2. Find session
    const session = await this.studentRepository.findSessionById(data.sessionId);
    if (!session) throw new Error('Session not found');

    // 3. Check already submitted
    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new Error('This quiz has already been submitted');
    }

    // 4. Save answers only (no grading)
    for (const ans of data.answers) {
      await this.studentRepository.saveAnswer({
        questionId:     ans.questionId,
        selectedAnswer: ans.selectedAnswer,
        session,
      });
    }

    // 5. Update session to completed
    session.status      = SessionStatus.COMPLETED;
    session.completedAt = new Date();
    await this.studentRepository.saveSession(session);

    return {
      message: 'Quiz submitted successfully',
      data: {
        fullname: session.fullname,
        email:    session.email,
        status:   'COMPLETED',
      },
    };
  }
}