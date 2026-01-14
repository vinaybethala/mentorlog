import { HomeworkStatus } from '@prisma/client';
import prisma from '../config/prisma';

export const getParentProfile = async (userId: string) => {
    return await prisma.parent.findFirst({
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
        },
    });
};

export const getChildren = async (parentId: string) => {
    return await prisma.student.findMany({
        where: { parentId },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });
};

export const verifyChildOwnership = async (parentId: string, studentId: string) => {
    const student = await prisma.student.findFirst({
        where: {
            id: studentId,
            parentId,
        },
    });
    return !!student;
};

export const getChildSessions = async (studentId: string) => {
    const now = new Date();
    return await prisma.session.findMany({
        where: { studentId },
        include: {
            tutor: {
                include: {
                    user: {
                        select: { name: true },
                    },
                },
            },
            media: true,
        },
        orderBy: {
            startTime: 'desc',
        },
    });
};

export const getChildHomeworks = async (studentId: string, status?: HomeworkStatus) => {
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

export const getNotifications = async (userId: string) => {
    return await prisma.notification.findMany({
        where: { userId },
        orderBy: {
            createdAt: 'desc',
        },
    });
};
