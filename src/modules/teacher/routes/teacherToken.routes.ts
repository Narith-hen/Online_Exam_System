import { Router } from 'express';
import { TeacherTokenController } from '../controllers/teacherToken.controller';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';
import { roleMiddleware } from '../../../shared/middlewares/role.middleware';

const router = Router();
const controller = new TeacherTokenController();
const TEACHER_ROLE_ID = process.env.TEACHER_ROLE_ID!;

// ── Public ──────────────────────────────────────────────────
router.get('/verify', controller.verifyToken);

// ── Protected ────────────────────────────────────────────────
router.get(
  '/my-tokens',
  authMiddleware,
  roleMiddleware([TEACHER_ROLE_ID]),
  controller.getMyTokens,
);

router.post(
  '/logout',
  authMiddleware,
  roleMiddleware([TEACHER_ROLE_ID]),
  controller.logout,
);

router.post(
  '/logout-all',
  authMiddleware,
  roleMiddleware([TEACHER_ROLE_ID]),
  controller.logoutAll,
);

export default router;