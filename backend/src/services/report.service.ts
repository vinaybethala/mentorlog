// src/services/report.service.ts
import prisma from '../config/prisma';

export class ReportService {
    /**
     * Tutor Reports: Total hours, sessions, and leave stats.
     */
    async getTutorReport(startDate?: Date, endDate?: Date) {
        const whereClause: any = {};
        if (startDate && endDate) {
            whereClause.startTime = { gte: startDate, lte: endDate };
        }

        const tutors = await prisma.tutor.findMany({
            include: {
                user: true,
                sessions: {
                    where: whereClause
                },
                leaves: true // Corrected from leaveRequests
            }
        });

        return tutors.map((tutor: any) => {
            const totalHours = tutor.sessions.reduce((acc: number, sess: any) => acc + (sess.duration || 0), 0) / 60;
            const totalSessions = tutor.sessions.length;
            const leaves = {
                approved: tutor.leaves.filter((l: any) => l.status === 'APPROVED').length,
                rejected: tutor.leaves.filter((l: any) => l.status === 'REJECTED').length,
                pending: tutor.leaves.filter((l: any) => l.status === 'PENDING').length
            };

            return {
                tutorId: tutor.id,
                name: tutor.user.name,
                totalHours: parseFloat(totalHours.toFixed(2)),
                totalSessions,
                leaves
            };
        });
    }

    /**
     * Student Reports: Sessions attended, subject-wise time, consistency.
     */
    async getStudentReport(startDate?: Date, endDate?: Date) {
        const whereClause: any = {};
        if (startDate && endDate) {
            whereClause.startTime = { gte: startDate, lte: endDate };
        }

        const students = await prisma.student.findMany({
            include: {
                user: true,
                sessions: {
                    where: whereClause
                }
            }
        });

        return students.map((student: any) => {
            const totalSessions = student.sessions.length;
            const subjectWiseTime: Record<string, number> = {};

            student.sessions.forEach((sess: any) => {
                if (!subjectWiseTime[sess.subject]) subjectWiseTime[sess.subject] = 0;
                subjectWiseTime[sess.subject] += (sess.duration || 0);
            });

            return {
                studentId: student.id,
                name: student.user.name,
                totalSessions,
                subjectWiseTime,
                daysActive: new Set(student.sessions.map((s: any) => s.startTime.toISOString().split('T')[0])).size
            };
        });
    }

    /**
     * Daily Academy Summary: Active tutors, sessions, total hours.
     */
    async getAcademySummary(date: Date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const sessions = await prisma.session.findMany({
            where: {
                startTime: { gte: startOfDay, lte: endOfDay }
            }
        });

        const activeTutors = new Set(sessions.map((s: any) => s.tutorId)).size;
        const totalTeachingHours = sessions.reduce((acc: number, s: any) => acc + (s.duration || 0), 0) / 60;

        return {
            date: date.toISOString().split('T')[0],
            activeTutors,
            totalSessions: sessions.length,
            totalTeachingHours: parseFloat(totalTeachingHours.toFixed(2))
        };
    }

    async getOverallStats() {
        const [totalTutors, totalStudents, totalSessions, totalHoursResult] = await Promise.all([
            prisma.tutor.count(),
            prisma.student.count(),
            prisma.session.count(),
            prisma.session.aggregate({
                _sum: {
                    duration: true
                }
            })
        ]);

        return {
            totalTutors,
            totalStudents,
            totalSessions,
            totalHours: parseFloat(((totalHoursResult._sum.duration || 0) / 60).toFixed(2))
        };
    }
}

export const reportService = new ReportService();
