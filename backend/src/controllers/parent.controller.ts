import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as ParentService from '../services/parent.service';
import { HomeworkStatus } from '@prisma/client';

export const getChildren = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const profile = await ParentService.getParentProfile(userId);
        if (!profile) return res.status(404).json({ message: 'Parent profile not found' });

        const children = await ParentService.getChildren(profile.id);
        res.json(children);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching children', error });
    }
};

export const getChildHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const studentId = req.params.studentId as string;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const profile = await ParentService.getParentProfile(userId);
        if (!profile) return res.status(404).json({ message: 'Parent profile not found' });

        const isOwner = await ParentService.verifyChildOwnership(profile.id, studentId);
        if (!isOwner) return res.status(403).json({ message: 'Access denied: not your child' });

        const sessions = await ParentService.getChildSessions(studentId);
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching child history', error });
    }
};

export const getChildHomeworks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const studentId = req.params.studentId as string;
        const { status } = req.query;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const profile = await ParentService.getParentProfile(userId);
        if (!profile) return res.status(404).json({ message: 'Parent profile not found' });

        const isOwner = await ParentService.verifyChildOwnership(profile.id, studentId);
        if (!isOwner) return res.status(403).json({ message: 'Access denied: not your child' });

        const homeworks = await ParentService.getChildHomeworks(
            studentId,
            status ? (status as string as HomeworkStatus) : undefined
        );
        res.json(homeworks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching child homeworks', error });
    }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const notifications = await ParentService.getNotifications(userId);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};
