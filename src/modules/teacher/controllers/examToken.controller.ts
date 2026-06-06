import { Request, Response } from 'express';
import { ExamService } from '../services/examToken.service';

function getParam(req: Request, name: string): string {
  const value = req.params[name as keyof typeof req.params];
  return typeof value === 'string' ? value : '';
}

export class ExamController {
  private service = new ExamService();

  getMyExams = async (_req: Request, res: Response) => {
    try {
      const result = await this.service.getMyExams(_req.user!.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch exams.' });
    }
  };

  getExamById = async (req: Request, res: Response) => {
    try {
      const examId = getParam(req, 'examId');
      const result = await this.service.getExamById(examId, req.user!.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Exam not found.' });
    }
  };

  createExam = async (req: Request, res: Response) => {
    try {
      const result = await this.service.createExam(req.user!.id, req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to create exam.' });
    }
  };

  updateExam = async (req: Request, res: Response) => {
    try {
      const examId = getParam(req, 'examId');
      const result = await this.service.updateExam(examId, req.user!.id, req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to update exam.' });
    }
  };

  deleteExam = async (req: Request, res: Response) => {
    try {
      const examId = getParam(req, 'examId');
      const result = await this.service.deleteExam(examId, req.user!.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to delete exam.' });
    }
  };

  createQuestion = async (req: Request, res: Response) => {
    try {
      const examId = getParam(req, 'examId');
      const result = await this.service.createQuestion(examId, req.user!.id, req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to create question.' });
    }
  };

  updateQuestion = async (req: Request, res: Response) => {
    try {
      const questionId = getParam(req, 'questionId');
      const result = await this.service.updateQuestion(questionId, req.user!.id, req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to update question.' });
    }
  };

  deleteQuestion = async (req: Request, res: Response) => {
    try {
      const questionId = getParam(req, 'questionId');
      const result = await this.service.deleteQuestion(questionId, req.user!.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to delete question.' });
    }
  };

  createAnswer = async (req: Request, res: Response) => {
    try {
      const questionId = getParam(req, 'questionId');
      const result = await this.service.createAnswer(questionId, req.user!.id, req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to create answer.' });
    }
  };

  updateAnswer = async (req: Request, res: Response) => {
    try {
      const answerId = getParam(req, 'answerId');
      const result = await this.service.updateAnswer(answerId, req.user!.id, req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to update answer.' });
    }
  };

  deleteAnswer = async (req: Request, res: Response) => {
    try {
      const answerId = getParam(req, 'answerId');
      const result = await this.service.deleteAnswer(answerId, req.user!.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to delete answer.' });
    }
  };
}
