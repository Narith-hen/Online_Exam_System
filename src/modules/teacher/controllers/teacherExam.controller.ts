import { Request, Response } from 'express';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { teacherExamService } from '../services/teacherExam.service';

type HttpError = {
  message?: string;
  getStatus?: () => number;
};

const parseParam = (value: string | string[] | undefined, name: string): string => {
  if (Array.isArray(value) || !value) {
    throw new BadRequestException(`${name} is required`);
  }

  return value.trim();
};

const parseNumericId = (value: string | string[] | undefined, name: string): number => {
  const id = Number(parseParam(value, name));
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestException(`${name} must be a valid number`);
  }

  return id;
};

const parseExpiresInMinutes = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const minutes = Number(value);
  if (!Number.isInteger(minutes) || minutes <= 0) {
    throw new BadRequestException('expiresInMinutes must be a positive number');
  }

  return minutes;
};

const sendError = (res: Response, error: unknown, overrideMessage?: string): void => {
  const httpError = error as HttpError;
  const status = httpError.getStatus?.() ?? 500;
  const message = overrideMessage ?? httpError.message ?? 'Internal server error';

  res.status(status).json({ message });
};

export const getAllExams = async (req: Request, res: Response) => {
  try {
    const exams = await teacherExamService.getAllExams();
    res.status(200).json({ data: exams });
  } catch (error) {
    sendError(res, error);
  }
};

export const getExamById = async (req: Request, res: Response) => {
  try {
    const examId = parseParam(req.params.examId, 'examId');
    const exam = await teacherExamService.getExamById(examId);
    res.status(200).json({ data: exam });
  } catch (error) {
    sendError(res, error);
  }
};

export const createExam = async (req: Request, res: Response) => {
  try {
    const exam = await teacherExamService.createExam(req.body);
    res.status(201).json({ message: 'Exam created', data: exam });
  } catch (error) {
    sendError(res, error);
  }
};

export const updateExam = async (req: Request, res: Response) => {
  try {
    const examId = parseParam(req.params.examId, 'examId');
    const exam = await teacherExamService.updateExam(examId, req.body);
    res.status(200).json({ message: 'Exam updated', data: exam });
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  try {
    const examId = parseParam(req.params.examId, 'examId');
    await teacherExamService.deleteExam(examId);
    res.status(200).json({ message: 'Exam deleted' });
  } catch (error) {
    sendError(res, error);
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const examId = parseParam(req.params.examId, 'examId');
    const question = await teacherExamService.addQuestion(examId, req.body);
    res.status(201).json({ message: 'Question created', data: question });
  } catch (error) {
    sendError(res, error);
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const questionId = parseParam(req.params.questionId, 'questionId');
    const question = await teacherExamService.updateQuestion(questionId, req.body);
    res.status(200).json({ message: 'Question updated', data: question });
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const questionId = parseParam(req.params.questionId, 'questionId');
    await teacherExamService.deleteQuestion(questionId);
    res.status(200).json({ message: 'Question deleted' });
  } catch (error) {
    sendError(res, error);
  }
};

export const createAnswer = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Answer endpoints are not implemented yet' });
};

export const updateAnswer = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Answer endpoints are not implemented yet' });
};

export const deleteAnswer = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Answer endpoints are not implemented yet' });
};

export const getExamResults = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Result endpoints are not implemented yet' });
};

export const getStudentResult = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Result endpoints are not implemented yet' });
};

export const generateStudentCode = async (req: Request, res: Response) => {
  try {
    const examIdOrCode = parseParam(req.params.examCode, 'examCode');
    // const examIdOrCode = parseParam(req.params.examCode, 'examCode');
    const studentId =
      typeof req.body?.studentId === 'string' && req.body.studentId.trim()
        ? req.body.studentId.trim()
        : undefined;
    const requestedAccessCode =
      req.body && Object.prototype.hasOwnProperty.call(req.body, 'accessCode') &&
      typeof req.body.accessCode === 'string'
        ? req.body.accessCode
        : undefined;

    const accessCode = await teacherExamService.generateStudentCode(
      examIdOrCode,
      studentId,
      requestedAccessCode
    );
    res.status(201).json(accessCode);
  } catch (error) {
    const message =
      error instanceof NotFoundException
        ? 'Exam not found. Use an existing examCode or examId in the URL.'
        : (error as HttpError).message ?? 'Could not create access code.';

    sendError(res, error, message);
  }
};

export const getExamAccessCode = async (req: Request, res: Response) => {
  try {
    // const examIdOrCode = parseParam(req.params.examId, 'examId');
    const examIdOrCode = parseParam(req.params.examCode, 'examCode');
    const exam = await teacherExamService.getExamByIdOrCode(examIdOrCode);

    if (!exam.accessCode) {
      throw new NotFoundException(
        'No access code yet. Create one first.'
      );
    }

    res.status(200).json({
      accessCode: exam.accessCode,
      examCode: exam.examCode,
      examLink: exam.examLink,
    });
  } catch (error) {
    const message =
      error instanceof NotFoundException
        ? error.message
        : 'Could not get access code.';

    sendError(res, error, message);
  }
};

export const getExamAccessCodeById = async (req: Request, res: Response) => {
  try {
    const examId = parseParam(req.params.examId, 'examId');
    const exam = await teacherExamService.getExamById(examId);

    if (!exam.accessCode) {
      throw new NotFoundException('No access code yet. Create one first.');
    }

    res.status(200).json({
      examId: exam.examId,
      accessCode: exam.accessCode,
      examCode: exam.examCode,
      examLink: exam.examLink,
    });
  } catch (error) {
    const message =
      error instanceof NotFoundException
        ? error.message
        : 'Could not get access code by id.';

    sendError(res, error, message);
  }
};

export const getExamByAccessCode = async (req: Request, res: Response) => {
  try {
    const code = parseParam(req.params.code, 'code');
    const exam = await teacherExamService.getExamByCodeOrAccessCode(code);
    res.status(200).json({ data: exam });
  } catch (error) {
    const message =
      error instanceof NotFoundException
        ? 'No exam found for this code.'
        : 'Could not get exam by code.';

    sendError(res, error, message);
  }
};
