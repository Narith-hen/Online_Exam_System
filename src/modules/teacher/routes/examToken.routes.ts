import { Router } from 'express';
import { ExamController } from '../controllers/examToken.controller';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';
import { roleMiddleware } from '../../../shared/middlewares/role.middleware';

const router = Router();
const controller = new ExamController();
const TEACHER_ROLE_ID = process.env.TEACHER_ROLE_ID!;

router.use(authMiddleware, roleMiddleware([TEACHER_ROLE_ID]));

router.get('/my-exams', controller.getMyExams);
router.get('/:examId', controller.getExamById);
router.post('/', controller.createExam);
router.put('/:examId', controller.updateExam);
router.delete('/:examId', controller.deleteExam);

router.post('/:examId/questions', controller.createQuestion);
router.put('/:examId/questions/:questionId', controller.updateQuestion);
router.delete('/:examId/questions/:questionId', controller.deleteQuestion);

router.post('/:examId/questions/:questionId/answers', controller.createAnswer);
router.put('/:examId/questions/:questionId/answers/:answerId', controller.updateAnswer);
router.delete('/:examId/questions/:questionId/answers/:answerId', controller.deleteAnswer);

export default router;
