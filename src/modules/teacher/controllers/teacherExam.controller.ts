import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { TeacherService } from "../services/teacherExam.service";
import { CreateExamDto } from "../dto/create-exam.dto";
import { CreateQuestionDto } from "../dto/create-question.dto";

@Controller("teacher")
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post("exams")
  @HttpCode(HttpStatus.CREATED)
  async createExam(@Body() dto: CreateExamDto) {
    const exam = await this.teacherService.createExam(dto);
    return { message: "Exam created", exam };
  }

  @Post("exams/:id/questions")
  @HttpCode(HttpStatus.CREATED)
  async addQuestion(@Param("id") id: string, @Body() dto: CreateQuestionDto) {
    const question = await this.teacherService.addQuestion(Number(id), dto);
    return { message: "Question added", question };
  }

  @Get("exams")
  async getAllExams() {
    return this.teacherService.getAllExams();
  }

  @Get("exams/:id")
  async getExamById(@Param("id") id: string) {
    return this.teacherService.getExamById(Number(id));
  }

  @Get("exams/code/:examCode")
  async getExamByCode(@Param("examCode") examCode: string) {
    return this.teacherService.getExamByCode(examCode);
  }

  @Get("exams/:id/link")
  async generateLink(@Param("id") id: string, @Req() req: Request) {
    const exam = await this.teacherService.getExamById(Number(id));
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const link = this.teacherService.generateExamLink(exam.examCode, baseUrl);
    return { examCode: exam.examCode, link };
  }

  @Delete("questions/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param("id") id: string) {
    await this.teacherService.deleteQuestion(Number(id));
  }
}