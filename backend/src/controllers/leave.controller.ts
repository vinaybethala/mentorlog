// src/controllers/leave.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { leaveService } from '../services/leave.service';
import { LeaveStatus } from '@prisma/client';

export const apply = async (req: AuthRequest, res: Response) => {
    try {
        const tutorId = req.user?.id;
        if (!tutorId) return res.status(401).json({ message: 'Unauthorized' });

        const { startDate, endDate, reason } = req.body;
        if (!startDate || !endDate || !reason) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const leave = await leaveService.applyForLeave(tutorId, new Date(startDate), new Date(endDate), reason);
        res.status(201).json(leave);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
    try {
        const adminId = req.user?.id;
        if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

        const { leaveId, status } = req.body;
        if (!leaveId || !status) {
            return res.status(400).json({ message: 'Missing leaveId or status' });
        }

        const updatedLeave = await leaveService.updateLeaveStatus(leaveId, adminId, status as LeaveStatus);
        res.json(updatedLeave);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
    try {
        const { tutorId } = req.query;
        const history = await leaveService.getLeaveHistory(tutorId as string);
        res.json(history);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
