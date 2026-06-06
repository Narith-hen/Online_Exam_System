import { ExamRepository } from '../repositories/examToken.repository';
import {
  CreateExamDto, UpdateExamDto,
  CreateQuestionDto, UpdateQuestionDto,
  CreateAnswerDto, UpdateAnswerDto,
} from '../dto/examToken.dto';

export class ExamService {
  private repo = new ExamRepository();

  async getMyExams(teacherId: string) {
    const exams = await this.repo.findAllByTeacher(teacherId);
    return { message: 'Exams fetched successfully.', data: exams };
  }

  async getExamById(examId: string, teacherId: string) {
    const exam = await this.repo.findOneByTeacher(examId, teacherId);
    if (!exam) throw new Error('Exam not found or access denied.');
    return { message: 'Exam fetched successfully.', data: exam };
  }

  async createExam(teacherId: string, dto: CreateExamDto) {
    if (!dto.title?.trim()) throw new Error('Exam title is required.');
    const exam = await this.repo.createExam(teacherId, dto);
    return { message: 'Exam created successfully.', data: exam };
  }

  async updateExam(examId: string, teacherId: string, dto: UpdateExamDto) {
    const exam = await this.repo.updateExam(examId, teacherId, dto);
    if (!exam) throw new Error('Exam not found or access denied.');
    return { message: 'Exam updated successfully.', data: exam };
  }

  async deleteExam(examId: string, teacherId: string) {
    const result = await this.repo.deleteExam(examId, teacherId);
    if (!result) throw new Error('Exam not found or access denied.');
    return { message: 'Exam deleted successfully.' };
  }

  async createQuestion(examId: string, teacherId: string, dto: CreateQuestionDto) {
    if (!dto.questionText?.trim()) throw new Error('Question content is required.');
    const question = await this.repo.createQuestion(examId, teacherId, dto);
    if (!question) throw new Error('Exam not found or access denied.');
    return { message: 'Question created successfully.', data: question };
  }

  async updateQuestion(questionId: string, teacherId: string, dto: UpdateQuestionDto) {
    const question = await this.repo.updateQuestion(questionId, teacherId, dto);
    if (!question) throw new Error('Question not found or access denied.');
    return { message: 'Question updated successfully.', data: question };
  }

  async deleteQuestion(questionId: string, teacherId: string) {
    const result = await this.repo.deleteQuestion(questionId, teacherId);
    if (!result) throw new Error('Question not found or access denied.');
    return { message: 'Question deleted successfully.' };
  }

  async createAnswer(questionId: string, teacherId: string, dto: CreateAnswerDto) {
    if (!dto.content?.trim()) throw new Error('Answer content is required.');
    const answer = await this.repo.createAnswer(questionId, teacherId, dto);
    if (!answer) throw new Error('Question not found or access denied.');
    return { message: 'Answer created successfully.', data: answer };
  }

  async updateAnswer(answerId: string, teacherId: string, dto: UpdateAnswerDto) {
    const answer = await this.repo.updateAnswer(answerId, teacherId, dto);
    if (!answer) throw new Error('Answer not found or access denied.');
    return { message: 'Answer updated successfully.', data: answer };
  }

  async deleteAnswer(answerId: string, teacherId: string) {
    const result = await this.repo.deleteAnswer(answerId, teacherId);
    if (!result) throw new Error('Answer not found or access denied.');
    return { message: 'Answer deleted successfully.' };
  }
}
