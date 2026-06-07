import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware'; // ✅ correct path

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({ message: 'Student module is running' });
});

// 🔓 Public
router.post('/login', (req, res) => new StudentController().login(req, res));

// 🔒 Protected
router.post('/quiz/start', authMiddleware, (req, res) => new StudentController().startQuiz(req, res));
router.post('/quiz/submit', authMiddleware, (req, res) => new StudentController().submitQuiz(req, res));

export default router;