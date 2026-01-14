import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import * as ParentController from '../controllers/parent.controller';

const router = Router();

router.use(authenticateJWT);

router.get('/children', ParentController.getChildren);
router.get('/children/:studentId/history', ParentController.getChildHistory);
router.get('/children/:studentId/homework', ParentController.getChildHomeworks);
router.get('/notifications', ParentController.getNotifications);

export default router;
