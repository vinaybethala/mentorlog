// src/services/notification.service.ts
import prisma from '../config/prisma';

export type NotificationType = 'session_start' | 'session_end' | 'homework_pending';

export class NotificationService {
    /**
     * Creates a notification for a user.
     */
    async createNotification(userId: string, type: NotificationType, title: string, message: string) {
        return await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                isRead: false
            }
        });
    }

    /**
     * Fetches all notifications for a specific user.
     */
    async getUserNotifications(userId: string) {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Helper to notify parents and admins.
     */
    async notifyStakeholders(studentId: string, type: NotificationType, title: string, message: string) {
        // 1. Find the parent of the student
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { parent: true }
        });

        if (student?.parent?.userId) {
            await this.createNotification(student.parent.userId, type, title, message);
        }

        // 2. Find admins
        const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
        for (const admin of admins) {
            await this.createNotification(admin.id, type, title, message);
        }
    }
}

export const notificationService = new NotificationService();
