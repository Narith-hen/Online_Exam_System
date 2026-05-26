import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';

const router = Router();
const controller = new StudentController();

router.post('/start',  controller.startQuiz);
router.post('/submit', controller.submitQuiz);

export default router;