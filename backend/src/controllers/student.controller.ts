import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as StudentService from '../services/student.service';
import { HomeworkStatus } from '@prisma/client';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const profile = await StudentService.getStudentProfile(userId);
        if (!profile) return res.status(404).json({ message: 'Student profile not found' });

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

export const getWeeklyProgress = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const profile = await StudentService.getStudentProfile(userId);
        if (!profile) return res.status(404).json({ message: 'Student profile not found' });

        const progress = await StudentService.getWeeklyProgress(profile.id);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weekly progress', error });
    }
};

export const getHomeworks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { status } = req.query;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const profile = await StudentService.getStudentProfile(userId);
        if (!profile) return res.status(404).json({ message: 'Student profile not found' });

        const homeworks = await StudentService.getHomeworkList(
            profile.id,
            status ? (status as HomeworkStatus) : undefined
        );
        res.json(homeworks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching homeworks', error });
    }
};

export const getUpcomingPlan = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const profile = await StudentService.getStudentProfile(userId);
        if (!profile) return res.status(404).json({ message: 'Student profile not found' });

        const plans = await StudentService.getUpcomingPlan(profile.id);
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching upcoming plans', error });
    }
};

export const getSessionHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const profile = await StudentService.getStudentProfile(userId);
        if (!profile) return res.status(404).json({ message: 'Student profile not found' });

        const history = await StudentService.getSessionHistory(profile.id);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching session history', error });
    }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const notifications = await StudentService.getNotifications(userId);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};
