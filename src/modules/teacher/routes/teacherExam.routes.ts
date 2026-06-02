import { Router } from 'express';
import {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getExamResults,
  getStudentResult,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
} from '../../teacher/controllers';   // ← Clean import from index.ts

const router = Router();

// ── EXAM ROUTES ──────────────────────────────────────
router.get('/', getAllExams);
router.get('/:examId', getExamById);
router.post('/create', createExam);
router.put('/:examId', updateExam);
router.delete('/:examId', deleteExam);

// ── QUESTION ROUTES ──────────────────────────────────
router.post('/:examId/questions', createQuestion);
router.put('/:examId/questions/:questionId', updateQuestion);
router.delete('/:examId/questions/:questionId', deleteQuestion);

// ── ANSWER ROUTES ────────────────────────────────────
router.post('/:examId/questions/:questionId/answers', createAnswer);
router.put('/:examId/questions/:questionId/answers/:answerId', updateAnswer);
router.delete('/:examId/questions/:questionId/answers/:answerId', deleteAnswer);

// ── RESULT ROUTES ────────────────────────────────────
router.get('/:examId/results', getExamResults);
router.get('/:examId/results/:studentId', getStudentResult);

export default router;