import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { Question } from './entities/question.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import {CreateQuestionDto} from './dto/create-question.dto';


@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Exam)
    private examRepo: Repository<Exam>,

    // @InjectRepository(Answer)
    // private answerRepo: Repository<Answer>,
  ) {}

  // ── CREATE EXAM ──────────────────────────────
  async createExam(dto: CreateExamDto): Promise<{ examCode: string; link: string }> {
    const examCode = 'EX-' + Date.now().toString().slice(-6);

    const exam = this.examRepo.create({
      title: dto.title,
      examCode,
      questions: dto.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    });

    await this.examRepo.save(exam);

    return {
      examCode,
      link: `/exam/${examCode}`,
    };
  }

  // ── GET EXAM FOR STUDENT (no answers exposed) ─
  async getExamByCode(examCode: string) {
    const exam = await this.examRepo.findOne({
      where: { examCode },
      relations: ['questions'],
    });

    if (!exam) throw new NotFoundException('Exam not found');

    return {
      id: exam.id,
      title: exam.title,
      examCode: exam.examCode,
      questions: exam.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        // correctAnswer intentionally omitted
      })),
    };
  }

  // ── SUBMIT EXAM ───────────────────────────────
  async submitExam(
    examCode: string,
    studentName: string,
    studentEmail: string,
    responses: Record<string, string>,
  ) {
    const exam = await this.examRepo.findOne({
      where: { examCode },
      relations: ['questions'],
    });

    if (!exam) throw new NotFoundException('Exam not found');

    // Auto-grade
    let score = 0;
    for (const question of exam.questions) {
      if (responses[question.id] === question.correctAnswer) {
        score++;
      }
    }

    const answer = this.answerRepo.create({
      studentName,
      studentEmail,
      responses,
      score,
      exam,
    });

    await this.answerRepo.save(answer);

    return {
      score,
      total: exam.questions.length,
      message: `You scored ${score} out of ${exam.questions.length}`,
    };
  }

  // ── GET RESULTS (teacher view) ────────────────
  async getResults(examCode: string) {
    const exam = await this.examRepo.findOne({
      where: { examCode },
      relations: ['answers'],
    });

    if (!exam) throw new NotFoundException('Exam not found');
    return exam.answers;
  }
}