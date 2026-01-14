import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import * as TutorController from '../controllers/tutor.controller';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles('TUTOR'));

router.get('/students', TutorController.getStudents);

export default router;
