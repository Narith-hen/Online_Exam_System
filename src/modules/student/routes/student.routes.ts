import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';

const router = Router();

router.post('/login',                    (req, res) => new StudentController().login(req, res));
router.post('/quiz/start',               (req, res) => new StudentController().startQuiz(req, res));
router.post('/quiz/submit',              (req, res) => new StudentController().submitQuiz(req, res));
router.get('/quiz/result/:examSessionId',(req, res) => new StudentController().getResult(req, res));
router.get('/:studentId/results',        (req, res) => new StudentController().getMyResults(req, res));

export default router;