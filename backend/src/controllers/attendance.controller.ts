// src/controllers/attendance.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { attendanceService } from '../services/attendance.service';

export const login = async (req: AuthRequest, res: Response) => {
    try {
        const tutorId = req.user?.id;
        if (!tutorId) return res.status(401).json({ message: 'Unauthorized' });

        const record = await attendanceService.login(tutorId);
        res.status(201).json(record);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const logout = async (req: AuthRequest, res: Response) => {
    try {
        const tutorId = req.user?.id;
        if (!tutorId) return res.status(401).json({ message: 'Unauthorized' });

        const record = await attendanceService.logout(tutorId);
        res.status(200).json(record);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getSummary = async (req: AuthRequest, res: Response) => {
    try {
        // Admin only access ensured by routes
        const { tutorId, start, end } = req.query;
        const summary = await attendanceService.getAttendanceSummary(
            tutorId as string,
            start ? new Date(start as string) : undefined,
            end ? new Date(end as string) : undefined
        );
        res.json(summary);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
