// src/routes/notification.routes.ts
import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middlewares/auth.middleware';
import { notificationService } from '../services/notification.service';

const router = Router();

router.use(authenticateJWT);

/**
 * GET /api/notifications
 * Fetches all notifications for the authenticated user.
 */
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const notifications = await notificationService.getUserNotifications(userId);
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
