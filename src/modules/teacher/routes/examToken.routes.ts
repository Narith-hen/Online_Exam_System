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

export default router;
