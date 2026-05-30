import { Router } from 'express';
import teacherExamRoutes from './teacherExam.routes';

const router = Router();

// ── Connect exam routes ──
router.use('/exams', teacherExamRoutes);

export default router;