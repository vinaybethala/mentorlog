// src/routes/leave.routes.ts
import { Router } from 'express';
import { apply, updateStatus, getHistory } from '../controllers/leave.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticateJWT);

router.post('/apply', authorizeRoles('TUTOR'), apply);
router.patch('/status', authorizeRoles('ADMIN'), updateStatus);
router.get('/history', getHistory); // Tutors see theirs, Admins can filter

export default router;
