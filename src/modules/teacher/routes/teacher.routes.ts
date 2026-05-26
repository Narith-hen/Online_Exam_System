import { Router } from "express";
import { AuthController } from "../controllers/teacher.controller";

const router = Router();
const teacherController = new AuthController();

router.post("/login", teacherController.teacherLogin);

export default router;