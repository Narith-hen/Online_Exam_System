// import {
//   Controller,
//   Post,
//   Get,
//   Delete,
//   Param,
//   Body,
//   HttpCode,
//   HttpStatus,
//   Req,
// } from "@nestjs/common";
// import { Request } from "express";
// import { TeacherService } from "../services/teacherExam.service";
// import { CreateExamDto } from "../dto/create-exam.dto";
// import { CreateQuestionDto } from "../dto/create-question.dto";

// @Controller("teacher")
// export class TeacherController {
//   constructor(private readonly teacherService: TeacherService) {}

//   @Post("exams")
//   @HttpCode(HttpStatus.CREATED)
//   async createExam(@Body() dto: CreateExamDto) {
//     const exam = await this.teacherService.createExam(dto);
//     return { message: "Exam created", exam };
//   }

//   @Post("exams/:id/questions")
//   @HttpCode(HttpStatus.CREATED)
//   async addQuestion(@Param("id") id: string, @Body() dto: CreateQuestionDto) {
//     const question = await this.teacherService.addQuestion(Number(id), dto);
//     return { message: "Question added", question };
//   }

//   @Get("exams")
//   async getAllExams() {
//     return this.teacherService.getAllExams();
//   }

//   @Get("exams/:id")
//   async getExamById(@Param("id") id: string) {
//     return this.teacherService.getExamById(Number(id));
//   }

//   @Get("exams/code/:examCode")
//   async getExamByCode(@Param("examCode") examCode: string) {
//     return this.teacherService.getExamByCode(examCode);
//   }

//   @Get("exams/:id/link")
//   async generateLink(@Param("id") id: string, @Req() req: Request) {
//     const exam = await this.teacherService.getExamById(Number(id));
//     const baseUrl = `${req.protocol}://${req.get("host")}`;
//     const link = this.teacherService.generateExamLink(exam.examCode, baseUrl);
//     return { examCode: exam.examCode, link };
//   }

//   @Delete("questions/:id")
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async deleteQuestion(@Param("id") id: string) {
//     await this.teacherService.deleteQuestion(Number(id));
//   }
// }


import { Request, Response } from 'express';

// ── EXAM ──────────────────────────────────────

export const getAllExams = async (req: Request, res: Response) => {
  try {
    // TODO: fetch all exams from DB
    res.status(200).json({ message: 'Get all exams' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getExamById = async (req: Request, res: Response) => {
  try {
    const { examId } = req.params;
    // TODO: fetch exam by examId
    res.status(200).json({ message: `Get exam ${examId}` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const createExam = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    // TODO: save new exam to DB
    res.status(201).json({ message: 'Exam created', data: body });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateExam = async (req: Request, res: Response) => {
  try {
    const { examId } = req.params;
    const body = req.body;
    // TODO: update exam in DB
    res.status(200).json({ message: `Exam ${examId} updated`, data: body });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  try {
    const { examId } = req.params;
    // TODO: delete exam from DB
    res.status(200).json({ message: `Exam ${examId} deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── QUESTION ──────────────────────────────────

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { examId } = req.params;
    const body = req.body; // { text, type, points }
    // TODO: save question linked to examId
    res.status(201).json({ message: `Question added to exam ${examId}`, data: body });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { examId, questionId } = req.params;
    const body = req.body;
    // TODO: update question in DB
    res.status(200).json({ message: `Question ${questionId} updated`, data: body });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { examId, questionId } = req.params;
    // TODO: delete question from DB
    res.status(200).json({ message: `Question ${questionId} deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── ANSWER ────────────────────────────────────

export const createAnswer = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    const body = req.body; // { text, isCorrect }
    // TODO: save answer linked to questionId
    res.status(201).json({ message: `Answer added to question ${questionId}`, data: body });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateAnswer = async (req: Request, res: Response) => {
  try {
    const { questionId, answerId } = req.params;
    const body = req.body;
    // TODO: update answer in DB
    res.status(200).json({ message: `Answer ${answerId} updated`, data: body });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteAnswer = async (req: Request, res: Response) => {
  try {
    const { questionId, answerId } = req.params;
    // TODO: delete answer from DB
    res.status(200).json({ message: `Answer ${answerId} deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── RESULT ────────────────────────────────────

export const getExamResults = async (req: Request, res: Response) => {
  try {
    const { examId } = req.params;
    // TODO: fetch all student results for this exam
    res.status(200).json({ message: `All results for exam ${examId}` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getStudentResult = async (req: Request, res: Response) => {
  try {
    const { examId, studentId } = req.params;
    // TODO: fetch one student's result
    res.status(200).json({ message: `Result of student ${studentId} for exam ${examId}` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};