import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../config/database.config";
import { Exam } from "../entities/exam.entity";
import { Question } from "../entities/question.entity";
import { CreateExamDto } from "../dto/create-exam.dto";
import { CreateQuestionDto } from "../dto/create-question.dto";
import { randomBytes, randomUUID } from "crypto";

export class TeacherService {
  private readonly examRepository: Repository<Exam>;
  private readonly questionRepository: Repository<Question>;

  constructor(
    examRepository = AppDataSource.getRepository(Exam),
    questionRepository = AppDataSource.getRepository(Question)
  ) {
    this.examRepository = examRepository;
    this.questionRepository = questionRepository;
  }

  private getExamTitle(dto: CreateExamDto): string {
    const title = dto.examTitle ?? dto.title;

    if (!title || title.trim().length < 3) {
      throw new BadRequestException("title is required and must be at least 3 characters");
    }

    return title.trim();
  }

  private generateExamCode(): string {
    return randomBytes(4).toString("hex").toUpperCase();
  }

  private generateAccessCode(): string {
    const accessCode = `AC${randomBytes(3).toString("hex").toUpperCase()}`;
    return this.normalizeAccessCode(accessCode);
  }

  private normalizeAccessCode(accessCode: string): string {
    const normalizedAccessCode = accessCode.trim();

    if (!normalizedAccessCode) {
      throw new BadRequestException("Please input code");
    }

    if (!/^[A-Z0-9]+$/.test(normalizedAccessCode)) {
      throw new BadRequestException(
        "Access code must use only capital letters and numbers"
      );
    }

    return normalizedAccessCode;
  }

  private async generateUniqueAccessCode(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const accessCode = this.generateAccessCode();
      const existingExam = await this.examRepository.findOne({
        where: { accessCode },
      });

      if (!existingExam) {
        return accessCode;
      }
    }

    throw new BadRequestException("Could not generate a unique access code");
  }

  async createExam(dto: CreateExamDto): Promise<Exam> {
    const examCode = this.generateExamCode();
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const exam = this.examRepository.create({
      examId: randomUUID(),
      createdBy: dto.createdBy ?? null,
      examTitle: this.getExamTitle(dto),
      description: dto.description ?? null,
      durationMinutes: dto.durationMinutes ?? 60,
      startWindow: dto.startWindow ? new Date(dto.startWindow) : null,
      endWindow: dto.endWindow ? new Date(dto.endWindow) : null,
      totalMarks: dto.totalMarks ?? 100,
      passingScore: dto.passingScore ?? 50,
      isPublished: dto.isPublished ?? false,
      examCode,
      examLink: this.generateExamLink(examCode, frontendUrl),
    });
    return this.examRepository.save(exam);
  }

  async updateExam(examId: string, dto: Partial<CreateExamDto>): Promise<Exam> {
    const exam = await this.getExamById(examId);
    const title = dto.examTitle ?? dto.title;

    if (title) {
      exam.examTitle = title.trim();
    }

    if (dto.description !== undefined) {
      exam.description = dto.description;
    }

    if (dto.durationMinutes !== undefined) {
      exam.durationMinutes = dto.durationMinutes;
    }

    if (dto.startWindow !== undefined) {
      exam.startWindow = dto.startWindow ? new Date(dto.startWindow) : null;
    }

    if (dto.endWindow !== undefined) {
      exam.endWindow = dto.endWindow ? new Date(dto.endWindow) : null;
    }

    if (dto.totalMarks !== undefined) {
      exam.totalMarks = dto.totalMarks;
    }

    if (dto.passingScore !== undefined) {
      exam.passingScore = dto.passingScore;
    }

    if (dto.isPublished !== undefined) {
      exam.isPublished = dto.isPublished;
    }

    return this.examRepository.save(exam);
  }

  async deleteExam(examId: string): Promise<void> {
    const exam = await this.getExamById(examId);
    await this.examRepository.remove(exam);
  }

  async addQuestion(examId: string, dto: CreateQuestionDto): Promise<Question> {
    const exam = await this.examRepository.findOne({ where: { examId } });
    if (!exam) throw new NotFoundException("Exam not found");

    if (!dto.options.includes(dto.correctAnswer)) {
      throw new BadRequestException("Correct answer must match one of the 4 options");
    }

    const question = this.questionRepository.create({ ...dto, examId });
    return this.questionRepository.save(question);
  }

  async updateQuestion(
    questionId: number,
    dto: Partial<CreateQuestionDto>
  ): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });
    if (!question) throw new NotFoundException("Question not found");

    if (dto.questionText) {
      question.questionText = dto.questionText;
    }

    if (dto.options) {
      question.options = dto.options;
    }

    if (dto.correctAnswer) {
      const options = dto.options ?? question.options;
      if (!options.includes(dto.correctAnswer)) {
        throw new BadRequestException("Correct answer must match one of the 4 options");
      }
      question.correctAnswer = dto.correctAnswer;
    }

    return this.questionRepository.save(question);
  }

  async deleteQuestion(questionId: number): Promise<void> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });
    if (!question) throw new NotFoundException("Question not found");

    await this.questionRepository.remove(question);
  }

  async getAllExams(): Promise<Exam[]> {
    return this.examRepository.find({
      relations: { questions: true },
      order: { createdAt: "DESC" },
    });
  }

  async getExamById(examId: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { examId },
    });
    if (!exam) throw new NotFoundException("Exam not found");
    return exam;
  }

  async getExamByCode(examCode: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { examCode },
      relations: { questions: true },
    });
    if (!exam) throw new NotFoundException("Exam not found");
    return exam;
  }

  async getExamByIdOrCode(value: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: [{ examId: value }, { examCode: value.toUpperCase() }],
    });
    if (!exam) throw new NotFoundException("Exam not found");
    return exam;
  }

  async getExamByAccessCode(accessCode: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { accessCode: accessCode.toUpperCase() },
      relations: { questions: true },
    });
    if (!exam) throw new NotFoundException("Exam not found");
    return exam;
  }

  async getExamByCodeOrAccessCode(code: string): Promise<Exam> {
    const normalizedCode = code.toUpperCase();
    const exam = await this.examRepository.findOne({
      where: [{ examCode: normalizedCode }, { accessCode: normalizedCode }],
      relations: { questions: true },
    });
    if (!exam) throw new NotFoundException("Exam not found");
    return exam;
  }

  async generateStudentCode(
    examIdOrCode: string,
    studentId?: string,
    requestedAccessCode?: string
  ): Promise<{ accessCode: string; studentId?: string; examCode: string; examLink: string | null }> {
    const exam = await this.getExamByIdOrCode(examIdOrCode);

    if (requestedAccessCode === undefined) {
      throw new BadRequestException('Please input code');
    }

    const accessCode = this.normalizeAccessCode(requestedAccessCode);
    const existingExam = await this.examRepository.findOne({
      where: { accessCode },
    });

    if (existingExam) {
      throw new ConflictException('This access code is already used by another exam');
    }

    exam.accessCode = accessCode;

    await this.examRepository.save(exam);

    return {
      accessCode: exam.accessCode,
      ...(studentId ? { studentId } : {}),
      examCode: exam.examCode,
      examLink: exam.examLink,
    };
  }

  generateExamLink(examCode: string, baseUrl: string): string {
    return `${baseUrl}/exam/${examCode}`;
  }
}

export const teacherExamService = new TeacherService();
