import { Router } from 'express';
import {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  getExamResults,
  getStudentResult,
} from '../controllers/teacherExam.controller';

const router = Router();

// ── EXAM ──────────────────────────────────────
router.get('/', getAllExams);
router.get('/:examId', getExamById);
router.post('/', createExam);
router.put('/:examId', updateExam);
router.delete('/:examId', deleteExam);

// ── QUESTION ──────────────────────────────────
router.post('/:examId/questions', createQuestion);
router.put('/:examId/questions/:questionId', updateQuestion);
router.delete('/:examId/questions/:questionId', deleteQuestion);

// ── ANSWER ────────────────────────────────────
router.post('/:examId/questions/:questionId/answers', createAnswer);
router.put('/:examId/questions/:questionId/answers/:answerId', updateAnswer);
router.delete('/:examId/questions/:questionId/answers/:answerId', deleteAnswer);

// ── RESULT ────────────────────────────────────
router.get('/:examId/results', getExamResults);
router.get('/:examId/results/:studentId', getStudentResult);

export default router;