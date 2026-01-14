import { Router } from 'express';
import { addTutor, enrollStudent, addParent, getTutors, getStudents, getParents } from '../controllers/admin.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles('ADMIN'));

router.post('/tutors', addTutor);
router.post('/students', enrollStudent);
router.post('/parents', addParent);

router.get('/tutors', getTutors);
router.get('/students', getStudents);
router.get('/parents', getParents);

export default router;
