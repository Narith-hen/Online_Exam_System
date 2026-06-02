import { Router } from "express";
import { AuthController } from "../controllers/teacher.controller";
import teacherExamRoutes from './teacherExam.routes';

const router = Router();
const teacherController = new AuthController();

router.post("/login", teacherController.teacherLogin);
router.post("/register", teacherController.teacherRegister);
router.post("/create", teacherController.teacherRegister);

router.get("/results", teacherController.teacherShowResult);

router.use('/exams', teacherExamRoutes);

export default router;
