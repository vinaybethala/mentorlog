// src/routes/report.routes.ts
import { Router } from 'express';
import { getTutorReport, getStudentReport, getAcademySummary, getOverallStats } from '../controllers/report.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

// All reporting routes are restricted to ADMIN only
router.use(authenticateJWT);
router.use(authorizeRoles('ADMIN'));

router.get('/tutors', getTutorReport);
router.get('/students', getStudentReport);
router.get('/academy-summary', getAcademySummary);
router.get('/overall-stats', getOverallStats);

export default router;
