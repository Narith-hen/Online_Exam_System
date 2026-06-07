import { AppDataSource } from '../../../config/database.config';
import { ExamEntity }     from '../entities/exam.entity';
import { QuestionEntity } from '../entities/question.entity';
import { Answer }        from '../entities/answer.entity';
import {
  CreateExamDto, UpdateExamDto,
  CreateQuestionDto, UpdateQuestionDto,
  CreateAnswerDto, UpdateAnswerDto,
} from '../dto/examToken.dto';

export class ExamRepository {
  private examRepo     = AppDataSource.getRepository(ExamEntity);
  private questionRepo = AppDataSource.getRepository(QuestionEntity);
  private answerRepo   = AppDataSource.getRepository(Answer);

  findAllByTeacher(teacherId: string) {
    return this.examRepo
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.questions', 'questions')
      .where('exam.createdBy = :teacherId', { teacherId })
      .orderBy('exam.createdAt', 'DESC')
      .getMany();
  }

  findOneByTeacher(examId: string, teacherId: string) {
    return this.examRepo
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.questions', 'questions')
      .leftJoinAndSelect('questions.answers', 'answers')
      .where('exam.examId = :examId', { examId })
      .andWhere('exam.createdBy = :teacherId', { teacherId })
      .getOne();
  }

  async createExam(teacherId: string, dto: CreateExamDto) {
    const exam = this.examRepo.create({
      ...dto,
      createdBy: teacherId,
    });
    return this.examRepo.save(exam);
  }

  async updateExam(examId: string, teacherId: string, dto: UpdateExamDto) {
    const exam = await this.findOneByTeacher(examId, teacherId);
    if (!exam) return null;
    Object.assign(exam, dto);
    return this.examRepo.save(exam);
  }

  async deleteExam(examId: string, teacherId: string) {
    const exam = await this.findOneByTeacher(examId, teacherId);
    if (!exam) return null;
    return this.examRepo.remove(exam);
  }

  async findQuestion(questionId: string, teacherId: string) {
    return this.questionRepo
      .createQueryBuilder('q')
      .innerJoin('q.exam', 'exam', 'exam.createdBy = :teacherId', { teacherId })
      .leftJoinAndSelect('q.answers', 'answers')
      .where('q.questionId = :questionId', { questionId })
      .getOne();
  }

  async createQuestion(examId: string, teacherId: string, dto: CreateQuestionDto) {
    const exam = await this.findOneByTeacher(examId, teacherId);
    if (!exam) return null;
    const question = this.questionRepo.create({ ...dto, examId });
    return this.questionRepo.save(question);
  }

  async updateQuestion(questionId: string, teacherId: string, dto: UpdateQuestionDto) {
    const question = await this.findQuestion(questionId, teacherId);
    if (!question) return null;
    Object.assign(question, dto);
    return this.questionRepo.save(question);
  }

  async deleteQuestion(questionId: string, teacherId: string) {
    const question = await this.findQuestion(questionId, teacherId);
    if (!question) return null;
    return this.questionRepo.remove(question);
  }

  async findAnswer(answerId: string, teacherId: string) {
    return this.answerRepo
      .createQueryBuilder('a')
      .innerJoin('a.question', 'q')
      .innerJoin('q.exam', 'exam', 'exam.createdBy = :teacherId', { teacherId })
      .where('a.answerId = :answerId', { answerId })
      .getOne();
  }

  async createAnswer(questionId: string, teacherId: string, dto: CreateAnswerDto) {
    const question = await this.findQuestion(questionId, teacherId);
    if (!question) return null;
    const answer = this.answerRepo.create({ ...dto, questionId });
    return this.answerRepo.save(answer);
  }

  async updateAnswer(answerId: string, teacherId: string, dto: UpdateAnswerDto) {
    const answer = await this.findAnswer(answerId, teacherId);
    if (!answer) return null;
    Object.assign(answer, dto);
    return this.answerRepo.save(answer);
  }

  async deleteAnswer(answerId: string, teacherId: string) {
    const answer = await this.findAnswer(answerId, teacherId);
    if (!answer) return null;
    return this.answerRepo.remove(answer);
  }
}
