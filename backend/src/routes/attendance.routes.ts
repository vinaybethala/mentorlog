// src/routes/attendance.routes.ts
import { Router } from 'express';
import { login, logout, getSummary } from '../controllers/attendance.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticateJWT);

router.post('/login', authorizeRoles('TUTOR'), login);
router.post('/logout', authorizeRoles('TUTOR'), logout);
router.get('/summary', authorizeRoles('ADMIN'), getSummary);

export default router;
