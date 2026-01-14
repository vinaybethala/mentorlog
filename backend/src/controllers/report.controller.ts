// src/controllers/report.controller.ts
import { Request, Response } from 'express';
import { reportService } from '../services/report.service';

export const getTutorReport = async (req: Request, res: Response) => {
    try {
        const { start, end } = req.query;
        const report = await reportService.getTutorReport(
            start ? new Date(start as string) : undefined,
            end ? new Date(end as string) : undefined
        );
        res.json(report);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentReport = async (req: Request, res: Response) => {
    try {
        const { start, end } = req.query;
        const report = await reportService.getStudentReport(
            start ? new Date(start as string) : undefined,
            end ? new Date(end as string) : undefined
        );
        res.json(report);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAcademySummary = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        const summary = await reportService.getAcademySummary(
            date ? new Date(date as string) : new Date()
        );
        res.json(summary);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOverallStats = async (req: Request, res: Response) => {
    try {
        const stats = await reportService.getOverallStats();
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
