// src/controllers/session.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sessionService } from '../services/session.service';

export const startSession = async (req: AuthRequest, res: Response) => {
    try {
        const tutorId = req.user?.id;
        if (!tutorId) return res.status(401).json({ message: 'Unauthorized' });

        const { studentId, subject, topic } = req.body;
        if (!studentId || !subject || !topic) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const session = await sessionService.startSession(tutorId, studentId, subject, topic);
        res.status(201).json(session);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const endSession = async (req: AuthRequest, res: Response) => {
    try {
        const tutorId = req.user?.id;
        if (!tutorId) return res.status(401).json({ message: 'Unauthorized' });

        const { sessionId, imageProofUrl } = req.body;
        if (!sessionId || !imageProofUrl) {
            return res.status(400).json({ message: 'Missing sessionId or imageProofUrl' });
        }

        const session = await sessionService.endSession(tutorId, sessionId, imageProofUrl);
        res.status(200).json(session);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getActiveSession = async (req: AuthRequest, res: Response) => {
    try {
        const tutorId = req.user?.id;
        if (!tutorId) return res.status(401).json({ message: 'Unauthorized' });

        const session = await sessionService.getActiveSession(tutorId);
        if (!session) {
            return res.status(404).json({ message: 'No active session found' });
        }

        res.status(200).json(session);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
