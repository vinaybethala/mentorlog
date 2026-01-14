import { HomeworkStatus } from '@prisma/client';
import prisma from '../config/prisma';

export const getStudentProfile = async (userId: string) => {
    return await prisma.student.findFirst({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            parent: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        }
                    }
                }
            }
        },
    });
};

export const getWeeklyProgress = async (studentId: string) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    const sessions = await prisma.session.findMany({
        where: {
            studentId,
            startTime: {
                gte: startOfWeek,
                lte: endOfWeek,
            },
        },
    });

    const totalDuration = sessions.reduce((acc, session) => acc + (session.duration || 0), 0);

    return {
        startDate: startOfWeek,
        endDate: endOfWeek,
        totalSessions: sessions.length,
        totalDurationMinutes: totalDuration,
        sessions,
    };
};

export const getHomeworkList = async (studentId: string, status?: HomeworkStatus) => {
    return await prisma.homework.findMany({
        where: {
            studentId,
            status: status ? status : undefined,
        },
        include: {
            assignedBy: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const getUpcomingPlan = async (studentId: string) => {
    const now = new Date();
    return await prisma.session.findMany({
        where: {
            studentId,
            startTime: {
                gt: now,
            },
        },
        include: {
            tutor: {
                include: {
                    user: {
                        select: { name: true }
                    }
                }
            }
        },
        orderBy: {
            startTime: 'asc',
        },
    });
};

export const getSessionHistory = async (studentId: string) => {
    const now = new Date();
    return await prisma.session.findMany({
        where: {
            studentId,
            startTime: {
                lte: now,
            },
        },
        include: {
            tutor: {
                include: {
                    user: {
                        select: { name: true }
                    }
                }
            },
            media: true,
        },
        orderBy: {
            startTime: 'desc',
        },
    });
};

export const getNotifications = async (userId: string) => {
    return await prisma.notification.findMany({
        where: { userId },
        orderBy: {
            createdAt: 'desc',
        },
    });
};
