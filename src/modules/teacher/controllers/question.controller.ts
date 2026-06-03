import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { ExamRepository } from '../repositories/exam.repository';
import { QuestionRepository } from '../repositories/question.repository';

const examRepository = new ExamRepository();
const questionRepository = new QuestionRepository();

// ==================== HELPERS ====================
function getParam(req: Request, name: string): string {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] : value;
}

function isBlank(value: unknown): boolean {
  return typeof value !== 'string' || value.trim().length === 0;
}

function isValidQuestionType(value: unknown): boolean {
  return typeof value === 'string' && ['multiple_choice', 'true_false', 'short_answer'].includes(value);
}

// ==================== QUESTION CONTROLLERS ====================

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const invalidFields: string[] = [];
    if (isBlank(req.body.questionText)) invalidFields.push('questionText');
    if (isBlank(req.body.questionType)) invalidFields.push('questionType');
    if (isBlank(req.body.correctAnswer)) invalidFields.push('correctAnswer');
    if (req.body.marks === undefined || Number(req.body.marks) <= 0) invalidFields.push('marks');

    if (invalidFields.length > 0) {
      res.status(400).json({ message: 'Please fill all required question fields.', fields: invalidFields });
      return;
    }

    if (!isValidQuestionType(req.body.questionType)) {
      res.status(400).json({
        message: 'Invalid questionType. Please use one of: multiple_choice, true_false, short_answer.',
        field: 'questionType',
        allowedValues: ['multiple_choice', 'true_false', 'short_answer'],
      });
      return;
    }

    const exam = await examRepository.findById(getParam(req, 'examId'));
    if (!exam) {
      res.status(404).json({ message: 'Sorry, we could not find this exam. Please check the exam id.' });
      return;
    }

    const question = questionRepository.create({
      questionId: randomUUID(),
      examId: exam.examId,
      questionText: req.body.questionText ?? '',
      questionType: req.body.questionType ?? 'multiple_choice',
      questionOptions: req.body.questionOptions ?? null,
      correctAnswer: req.body.correctAnswer ?? '',
      marks: Number(req.body.marks ?? 1),
    });

    res.status(201).json({
      message: 'Question created successfully',
      data: await questionRepository.save(question),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create question', error });
  }
};

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await questionRepository.findByIdAndExamId(
      getParam(req, 'questionId'),
      getParam(req, 'examId'),
    );

    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    res.status(200).json({
      message: 'Question updated successfully',
      data: await questionRepository.update(question, req.body),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update question', error });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await questionRepository.deleteByIdAndExamId(
      getParam(req, 'questionId'),
      getParam(req, 'examId'),
    );

    if (!deleted) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete question', error });
  }
};

export const createAnswer = async (req: Request, res: Response): Promise<void> => {
  res.status(201).json({
    message: 'Answer created successfully',
    data: { answerId: randomUUID(), questionId: req.params.questionId, ...req.body },
  });
};

export const updateAnswer = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    message: 'Answer updated successfully',
    data: { answerId: req.params.answerId, questionId: req.params.questionId, ...req.body },
  });
};

export const deleteAnswer = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    message: 'Answer deleted successfully',
    data: { answerId: req.params.answerId, questionId: req.params.questionId },
  });
};