import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../entities/exam.entity';
import { CreateExamDto } from '../dto/create-exam.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,
  ) {}

  // ── GET ALL EXAMS ─────────────────────────────
  async getAllExams() {
    const exams = await this.examRepo.find();
    return {
      message: 'Exams fetched successfully',
      data: exams,
    };
  }

  // ── GET EXAM BY ID ────────────────────────────
  async getExamById(examId: number) {
    const exam = await this.examRepo.findOne({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Exam not found');
    return {
      message: 'Exam fetched successfully',
      data: exam,
    };
  }

  // ── CREATE EXAM ───────────────────────────────
  async createExam(dto: CreateExamDto) {
    const examCode = 'EX-' + Date.now().toString().slice(-6);

    const exam = this.examRepo.create({
      examTitle: dto.examTitle,
      examCode,
    });

    await this.examRepo.save(exam);

    return {
      message: 'Exam created successfully',
      data: {
        id: exam.id,
        examTitle: exam.examTitle,
        examCode: exam.examCode,
        createdAt: exam.createdAt,
      },
    };
  }

  // ── UPDATE EXAM ───────────────────────────────
  async updateExam(examId: number, dto: Partial<CreateExamDto>) {
    const exam = await this.examRepo.findOne({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Exam not found');

    Object.assign(exam, dto);
    await this.examRepo.save(exam);

    return {
      message: 'Exam updated successfully',
      data: exam,
    };
  }

  // ── DELETE EXAM ───────────────────────────────
  async deleteExam(examId: number) {
    const exam = await this.examRepo.findOne({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Exam not found');

    await this.examRepo.remove(exam);

    return {
      message: 'Exam deleted successfully',
      data: null,
    };
  }

  // ── GET EXAM FOR STUDENT (no answers exposed) ─
  async getExamByCode(examCode: string) {
    const exam = await this.examRepo.findOne({ where: { examCode } });
    if (!exam) throw new NotFoundException('Exam not found');

    return {
      message: 'Exam fetched successfully',
      data: {
        id: exam.id,
        examTitle: exam.examTitle,
        examCode: exam.examCode,
        questions: exam.questions?.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options,
        })) ?? [],
      },
    };
  }
}