import { Router } from "express";
import { AuthController } from "../controllers/teacher.controller";
import teacherTokenRoutes from './teacherToken.routes';
import examTokenRoutes from './examToken.routes';
import teacherExamRoutes from './teacherExam.routes';

const router = Router();
const teacherController = new AuthController();

router.get('/', teacherController.teacherGetAll);
router.use('/token', teacherTokenRoutes);

router.post("/login", teacherController.teacherLogin);
router.post("/register", teacherController.teacherRegister);
router.post("/create", teacherController.teacherRegister);
router.get("/results", teacherController.teacherShowResult);
router.use('/exams', examTokenRoutes);
router.use('/exams', teacherExamRoutes);

export default router;


