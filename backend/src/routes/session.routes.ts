// src/routes/session.routes.ts
import { Router } from 'express';
import { startSession, endSession, getActiveSession } from '../controllers/session.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

// All session routes require TUTOR role
router.use(authenticateJWT);
router.use(authorizeRoles('TUTOR'));

router.post('/start', startSession);
router.post('/end', endSession);
router.get('/active', getActiveSession);

export default router;
