import { NextFunction, Request, Response, Router } from 'express';
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
  generateStudentCode,
  getExamAccessCode,
  getExamAccessCodeById,
  getExamByAccessCode,
} from '../controllers/teacherExam.controller';

const router = Router();

router.use((req: Request, _res: Response, next: NextFunction) => {
  const [path, query] = req.url.split('?');
  const cleanPath = path.replace(/(?:%0A|%0D|\s)+$/gi, '');

  req.url = query === undefined ? cleanPath : `${cleanPath}?${query}`;
  next();
});

// EXAM
router.get('/', getAllExams);
router.get('/access/:code', getExamByAccessCode);
router.get('/id/:examId/access-code', getExamAccessCodeById);
router.get('/:examId', getExamById);
router.post('/', createExam);
router.put('/:examId', updateExam);
router.delete('/:examId', deleteExam);

// QUESTION
router.post('/:examId/questions', createQuestion);
router.put('/:examId/questions/:questionId', updateQuestion);
router.delete('/:examId/questions/:questionId', deleteQuestion);

// ANSWER
router.post('/:examId/questions/:questionId/answers', createAnswer);
router.put('/:examId/questions/:questionId/answers/:answerId', updateAnswer);
router.delete('/:examId/questions/:questionId/answers/:answerId', deleteAnswer);

// RESULT
router.get('/:examId/results', getExamResults);
router.get('/:examId/results/:studentId', getStudentResult);

// ACCESS CODE
router.get('/:examCode/access-code', getExamAccessCode);
router.post('/:examCode/access-code', generateStudentCode);

export default router;
