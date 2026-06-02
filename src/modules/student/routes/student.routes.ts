import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({ message: 'Student module is running' });
});

router.post('/login',(req, res) => new StudentController().login(req, res));
router.post('/quiz/start',(req, res) => new StudentController().startQuiz(req, res));
router.post('/quiz/submit',(req, res) => new StudentController().submitQuiz(req, res));


export default router;
