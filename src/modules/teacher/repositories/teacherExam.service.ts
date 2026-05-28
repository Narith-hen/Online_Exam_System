import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Exam } from "../entities/exam.entity";
import { Question } from "../entities/question.entity";
import { CreateExamDto } from "../dto/create-exam.dto";
import { CreateQuestionDto } from "../dto/create-question.dto";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>
  ) {}

  async createExam(dto: CreateExamDto): Promise<Exam> {
    const examCode = uuidv4().substring(0, 8).toUpperCase();
    const exam = this.examRepository.create({
      examTitle: dto.examTitle,
      examCode,
    });
    return this.examRepository.save(exam);
  }

  async addQuestion(examId: number, dto: CreateQuestionDto): Promise<Question> {
    const exam = await this.examRepository.findOne({ where: { id: examId } });
    if (!exam) throw new NotFoundException("Exam not found");

    if (!dto.options.includes(dto.correctAnswer)) {
      throw new BadRequestException("Correct answer must match one of the 4 options");
    }

    const question = this.questionRepository.create({ ...dto, examId });
    return this.questionRepository.save(question);
  }

  async getAllExams(): Promise<Exam[]> {
    return this.examRepository.find({
      relations: ["questions"],
      order: { createdAt: "DESC" },
    });
  }

  async getExamById(id: number): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ["questions"],
    });
    if (!exam) throw new NotFoundException("Exam not found");
    return exam;
  }

  async getExamByCode(examCode: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { examCode },
      relations: ["questions"],
    });
    if (!exam) throw new NotFoundException("Exam not found");
    return exam;
  }

  async deleteQuestion(questionId: number): Promise<void> {
    const q = await this.questionRepository.findOne({ where: { id: questionId } });
    if (!q) throw new NotFoundException("Question not found");
    await this.questionRepository.remove(q);
  }

  generateExamLink(examCode: string, baseUrl: string): string {
    return `${baseUrl}/exam/${examCode}`;
  }
}