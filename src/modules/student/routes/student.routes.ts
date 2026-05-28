// routes/student.routes.ts
import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';

const router     = Router();
const controller = new StudentController();

// Specific routes MUST come first (before parameterized routes)
router.post('/login', controller.login);
router.post('/quiz/start', controller.startQuiz);
router.post('/quiz/submit', controller.submitQuiz);
router.get('/quiz/result/:examSessionId', controller.getResult);

// General parameterized routes come LAST
router.get('/:studentId/results', controller.getMyResults);

export default router;