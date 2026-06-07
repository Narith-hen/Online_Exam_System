import { AppDataSource } from '../../../config/database.config';
import { ExamEntity } from '../entities/exam.entity';
import { QuestionEntity } from '../entities/question.entity';
import { Answer } from '../entities/answer.entity';

export class ExamRepository2 {
  examRepository = AppDataSource.getRepository(ExamEntity);
  questionRepository = AppDataSource.getRepository(QuestionEntity);
  answerRepository = AppDataSource.getRepository(Answer);

  async findAll() {
    return this.examRepository.find({ relations: { questions: true } });
  }

  async findAllWithQuestions() {
    return this.examRepository.find({ relations: { questions: true } });
  }

  async findById(examId: string) {
    return this.examRepository.findOne({ where: { examId }, relations: { questions: true } });
  }

  async findByIdWithQuestions(examId: string) {
    return this.examRepository.findOne({ where: { examId }, relations: { questions: true } });
  }

  create(examData: Partial<ExamEntity>): ExamEntity {
    return this.examRepository.create(examData);
  }

  async save(exam: ExamEntity) {
    return this.examRepository.save(exam);
  }

  async update(examId: string, examData: Partial<ExamEntity>) {
    const exam = await this.examRepository.findOne({ where: { examId } });
    if (!exam) return null;
    this.examRepository.merge(exam, examData);
    return this.examRepository.save(exam);
  }

  async delete(examId: string) {
    const exam = await this.examRepository.findOne({ where: { examId } });
    if (!exam) return false;
    await this.examRepository.remove(exam);
    return true;
  }

  async deleteWithQuestions(examId: string) {
    await this.questionRepository.delete({ examId: examId as any });
    return this.delete(examId);
  }

  async addQuestion(examId: string, questionData: Partial<QuestionEntity>) {
    const question = this.questionRepository.create({ ...questionData, examId: examId as any, isRequired: questionData.isRequired ?? true });
    return this.questionRepository.save(question);
  }

  async updateQuestion(questionId: string, questionData: Partial<QuestionEntity>) {
    const question = await this.questionRepository.findOne({ where: { questionId: questionId as any } });
    if (!question) return null;
    this.questionRepository.merge(question, questionData);
    return this.questionRepository.save(question);
  }

  async deleteQuestion(questionId: string) {
    const question = await this.questionRepository.findOne({ where: { questionId: questionId as any } });
    if (!question) return false;
    await this.questionRepository.remove(question);
    return true;
  }

  async addAnswer(questionId: string, answerData: Partial<Answer>) {
    const answer = this.answerRepository.create({ ...answerData, questionId: questionId as any });
    return this.answerRepository.save(answer);
  }

  async updateAnswer(answerId: string, answerData: Partial<Answer>) {
    const answer = await this.answerRepository.findOne({ where: { answerId: answerId as any } });
    if (!answer) return null;
    this.answerRepository.merge(answer, answerData);
    return this.answerRepository.save(answer);
  }

  async deleteAnswer(answerId: string) {
    const answer = await this.answerRepository.findOne({ where: { answerId: answerId as any } });
    if (!answer) return false;
    await this.answerRepository.remove(answer);
    return true;
  }
}
