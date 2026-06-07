import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { ExamEntity } from '../entities/exam.entity';
import { QuestionEntity } from '../entities/question.entity';
import { ExamRepository2 } from '../repositories/exam.repository';
import { QuestionRepository } from '../repositories/question.repository';

const examRepository = new ExamRepository2();
const questionRepository = new QuestionRepository();

// ==================== SHARED HELPERS ====================
function getTeacherId(req: Request): string {
  const body = req.body as { createdBy?: string; teacherId?: string };
  return body.createdBy ?? body.teacherId ?? '00000000-0000-0000-0000-000000000000';
}

function getParam(req: Request, name: string): string {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] : value;
}

function generateExamCode(): string {
  return `EX${Date.now().toString(36).slice(-6).toUpperCase()}`;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function isForeignKeyError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ER_NO_REFERENCED_ROW_2';
}

function isDuplicateEntryError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ER_DUP_ENTRY';
}

function isBlank(value: unknown): boolean {
  return typeof value !== 'string' || value.trim().length === 0;
}

// ==================== EXAM CONTROLLERS ====================

export const getAllExams = async (_req: Request, res: Response): Promise<void> => {
  try {
    const exams = await examRepository.findAllWithQuestions();
    res.status(200).json({ message: 'Exams fetched successfully', data: exams });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exams', error });
  }
};

export const getExamById = async (req: Request, res: Response): Promise<void> => {
  try {
    const exam = await examRepository.findByIdWithQuestions(getParam(req, 'examId'));

    if (!exam) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }

    res.status(200).json({ message: 'Exam fetched successfully', data: exam });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exam', error });
  }
};

export const createExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Partial<ExamEntity> & {
      questions?: Partial<QuestionEntity>[];
      passingScore?: number;
      durationMinutes?: number;
      startWindow?: string;
      endWindow?: string;
    };

    const questions = body.questions ?? [];
    const totalMarks = questions.reduce((sum, q) => sum + Number(q.marks ?? 0), 0);
    const createdBy = getTeacherId(req);

    const missingFields: string[] = [];
    if (isBlank(createdBy)) missingFields.push('createdBy');
    if (isBlank(body.title)) missingFields.push('title');
    if (body.durationMinutes === undefined || Number(body.durationMinutes) <= 0) missingFields.push('durationMinutes');
    if (isBlank(body.startWindow)) missingFields.push('startWindow');
    if (isBlank(body.endWindow)) missingFields.push('endWindow');
    if (body.passingScore === undefined || Number(body.passingScore) < 0) missingFields.push('passingScore');
    if (body.questions !== undefined && !Array.isArray(body.questions)) missingFields.push('questions');

    if (missingFields.length > 0) {
      res.status(400).json({ message: 'Please fill all required exam fields.', fields: missingFields });
      return;
    }

    const invalidQuestionFields = questions.flatMap((question, index) => {
      const fields: string[] = [];
      if (isBlank(question.questionText)) fields.push(`questions[${index}].questionText`);
      if (isBlank(question.questionType)) fields.push(`questions[${index}].questionType`);
      if (isBlank(question.correctAnswer)) fields.push(`questions[${index}].correctAnswer`);
      if (question.marks === undefined || Number(question.marks) <= 0) fields.push(`questions[${index}].marks`);
      return fields;
    });

    if (invalidQuestionFields.length > 0) {
      res.status(400).json({ message: 'Please fill all required question fields.', fields: invalidQuestionFields });
      return;
    }

    if (!isUuid(createdBy)) {
      res.status(400).json({ message: 'Invalid createdBy. Please provide a valid teacher id.', field: 'createdBy' });
      return;
    }

    const exam = examRepository.create({
      examId: randomUUID(),
      createdBy,
      title: body.title ?? 'Untitled exam',
      description: body.description ?? null,
      durationMinutes: Number(body.durationMinutes ?? 60),
      startWindow: body.startWindow ? new Date(body.startWindow) : new Date(),
      endWindow: body.endWindow ? new Date(body.endWindow) : new Date(Date.now() + 60 * 60 * 1000),
      totalMarks,
      passingScore: Number(body.passingScore ?? 0),
      isPublished: Boolean(body.isPublished),
      examCode: body.examCode?.trim() || generateExamCode(),
      examLink: body.examLink ?? null,
    });

    const savedExam = await examRepository.save(exam);

    const savedQuestions = questions.length
      ? await questionRepository.saveMany(
          questions.map((q) =>
            questionRepository.create({
              questionId: randomUUID(),
              examId: savedExam.examId,
              questionText: q.questionText ?? '',
              questionType: q.questionType ?? 'multiple_choice',
              questionOptions: q.questionOptions ?? null,
              correctAnswer: q.correctAnswer ?? '',
              marks: Number(q.marks ?? 1),
            }),
          ),
        )
      : [];

    res.status(201).json({
      message: 'Exam created successfully',
      data: { ...savedExam, questions: savedQuestions },
    });
  } catch (error) {
    if (isForeignKeyError(error)) {
      res.status(400).json({ message: 'Invalid createdBy. Teacher does not exist.', field: 'createdBy' });
      return;
    }
    res.status(500).json({ message: 'Failed to create exam', error });
  }
};

export const updateExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const exam = await examRepository.findById(getParam(req, 'examId'));
    if (!exam) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }

    const { questions: _questions, createdBy: _createdBy, examId: _examId, ...updateBody } = req.body;

    if ('title' in updateBody && isBlank(updateBody.title)) {
      res.status(400).json({ message: 'Please fill all required exam fields.', fields: ['title'] });
      return;
    }

    const updatedExam = await examRepository.update(exam.examId, updateBody);

    res.status(200).json({ message: 'Exam updated successfully', data: updatedExam });
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      res.status(400).json({ message: 'examCode already exists. Please use another exam code.', field: 'examCode' });
      return;
    }
    res.status(500).json({ message: 'Failed to update exam', error });
  }
};

export const deleteExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const examId = getParam(req, 'examId');
    const deleted = await examRepository.deleteWithQuestions(examId);

    if (!deleted) {
      res.status(404).json({ message: 'Sorry, could not find this exam. It may have already been deleted.' });
      return;
    }

    res.status(200).json({ message: 'Exam deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete exam', error });
  }
};

export const getExamResults = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    message: 'Exam results fetched successfully',
    data: { examId: req.params.examId, results: [] },
  });
};

export const getStudentResult = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    message: 'Student result fetched successfully',
    data: {
      examId: req.params.examId,
      studentId: req.params.studentId,
      result: null,
    },
  });
};