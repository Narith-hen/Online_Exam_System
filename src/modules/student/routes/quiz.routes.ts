import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';

const router = Router();
const controller = new QuizController();

router.post('/create', controller.create);
router.get('/all',    controller.getAll);

export default router;