import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import * as StudentController from '../controllers/student.controller';

const router = Router();

router.use(authenticateJWT);

// Ensure only students access these routes (additional role check can be added if middleware doesn't enforce specific role)
// Assuming authenticateJWT populates req.user. Role check logic could be inside controller or separate middleware.
// For now, controllers fetch profile by userId, so if a non-student calls, they won't have a student profile and get 404.

router.get('/profile', StudentController.getProfile);
router.get('/progress', StudentController.getWeeklyProgress);
router.get('/homework', StudentController.getHomeworks);
router.get('/upcoming', StudentController.getUpcomingPlan);
router.get('/history', StudentController.getSessionHistory);
router.get('/notifications', StudentController.getNotifications);

export default router;
