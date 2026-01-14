// src/services/attendance.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AttendanceService {
    /**
     * Tracks tutor login (start of work).
     */
    async login(tutorId: string) {
        // Check if there's an active login record (mocked logic)
        // const activeRecord = await prisma.attendance.findFirst({
        //   where: { tutorId, logoutTime: null }
        // });
        const activeRecord = null; // Mocked

        if (activeRecord) {
            throw new Error('Tutor already has an active login session');
        }

        // Mocking attendance record creation
        // return await prisma.attendance.create({
        //   data: { tutorId, loginTime: new Date() }
        // });

        return {
            id: 'mock-attendance-id',
            tutorId,
            loginTime: new Date(),
            logoutTime: null
        };
    }

    /**
     * Tracks tutor logout (end of work).
     */
    async logout(tutorId: string) {
        // const activeRecord = await prisma.attendance.findFirst({
        //   where: { tutorId, logoutTime: null }
        // });
        const activeRecord = {
            id: 'mock-attendance-id',
            tutorId,
            loginTime: new Date(Date.now() - 28800000), // 8 hours ago
            logoutTime: null
        }; // Mocked

        if (!activeRecord) {
            throw new Error('No active login session found for this tutor');
        }

        const logoutTime = new Date();
        const durationMs = logoutTime.getTime() - activeRecord.loginTime.getTime();
        const durationMinutes = Math.floor(durationMs / (1000 * 60));

        // Mocking update
        // return await prisma.attendance.update({
        //   where: { id: activeRecord.id },
        //   data: { logoutTime, duration: durationMinutes }
        // });

        return {
            ...activeRecord,
            logoutTime,
            duration: durationMinutes
        };
    }

    /**
     * Admin view: Get tutor attendance summary.
     */
    async getAttendanceSummary(tutorId?: string, startDate?: Date, endDate?: Date) {
        // Mocking retrieval
        return [
            {
                tutorId: tutorId || 'mock-tutor-id',
                date: new Date().toISOString().split('T')[0],
                totalMinutes: 480
            }
        ];
    }
}

export const attendanceService = new AttendanceService();
