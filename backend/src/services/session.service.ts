// src/services/session.service.ts
import prisma from '../config/prisma';
import { notificationService } from './notification.service';

export class SessionService {
    /**
     * Starts a new session for a tutor and student.
     * Prevents multiple active sessions for the same tutor.
     */
    async startSession(tutorId: string, studentId: string, subject: string, topic: string) {
        // Check for an already active session for this tutor
        const activeSession = await prisma.session.findFirst({
            where: {
                tutorId,
                endTime: null
            }
        });

        if (activeSession) {
            throw new Error('Tutor already has an active session');
        }

        // Get tutor details for finding correct Tutor record ID
        const tutor = await prisma.tutor.findUnique({
            where: { userId: tutorId }
        });

        if (!tutor) {
            // Fallback if the tutorId passed is actually the userId (which it likely is from req.user.id)
            // We need to verify if we are using the internal Tutor ID or User ID. 
            // schema.prisma says Session relates to Tutor via tutorId. Tutor has `id` (uuid) and `userId`.
            // req.user.id is usually the User.id. We need to find the Tutor profile.
            // If the calling controller passes req.user.id, we must find the Tutor record first.
            const tutorProfile = await prisma.tutor.findUnique({ where: { userId: tutorId } });
            if (!tutorProfile) throw new Error('Tutor profile not found');

            // However, to keep it clean, let's assume the controller handles or we lookup here.
            // Let's lookup here to be safe since the controller passes req.user.id
            /* The controller passes req.user.id as tutorId. */
        }

        // Find Tutor profile by User ID
        const tutorProfile = await prisma.tutor.findUnique({ where: { userId: tutorId } });
        if (!tutorProfile) throw new Error('Tutor profile not found');

        // Find Student profile by ID (assuming studentId passed is the Student UUID, not User UUID)
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { user: true }
        });
        if (!student) throw new Error('Student not found');


        const session = await prisma.session.create({
            data: {
                tutorId: tutorProfile.id,
                studentId,
                subject,
                topic,
                startTime: new Date()
            }
        });

        // Trigger notifications
        // Notify Parent (via Stakeholders) and Admins
        await notificationService.notifyStakeholders(
            studentId,
            'session_start',
            'Session Started',
            `Tutoring session for ${student.user.name} - ${subject} (${topic}) has started.`
        );

        // Notify Student directly
        await notificationService.createNotification(
            student.userId,
            'session_start',
            'Session Started',
            `Your tutoring session for ${subject} (${topic}) has started.`
        );

        return session;
    }

    /**
     * Ends an active session for a tutor.
     * Calculates duration in minutes and stores image proof URL.
     */
    async endSession(tutorId: string, sessionId: string, imageProofUrl: string) {
        // Find Tutor profile
        const tutorProfile = await prisma.tutor.findUnique({ where: { userId: tutorId } });
        if (!tutorProfile) throw new Error('Tutor profile not found');

        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { student: { include: { user: true } } }
        });

        if (!session) {
            throw new Error('Session not found');
        }

        if (session.tutorId !== tutorProfile.id) {
            throw new Error('Unauthorized: Session does not belong to this tutor');
        }

        if (session.endTime) {
            throw new Error('Session already ended');
        }

        const endTime = new Date();
        const durationMs = endTime.getTime() - session.startTime.getTime();
        const durationMinutes = Math.max(1, Math.floor(durationMs / (1000 * 60))); // Minimum 1 minute

        // Update session and create media proof
        const [updatedSession] = await prisma.$transaction([
            prisma.session.update({
                where: { id: sessionId },
                data: {
                    endTime,
                    duration: durationMinutes
                }
            }),
            prisma.media.create({
                data: {
                    sessionId: sessionId,
                    url: imageProofUrl
                }
            })
        ]);

        // Trigger notifications
        // Notify Parent/Admin
        await notificationService.notifyStakeholders(
            session.studentId,
            'session_end',
            'Session Ended',
            `Tutoring session for ${session.student.user.name} - ${session.subject} ended. Duration: ${durationMinutes} mins.`
        );

        // Notify Student
        await notificationService.createNotification(
            session.student.userId,
            'session_end',
            'Session Ended',
            `Your tutoring session for ${session.subject} ended. Duration: ${durationMinutes} mins.`
        );

        return updatedSession;
    }

    /**
     * Gets the current active session for a tutor.
     */
    async getActiveSession(tutorId: string) {
        const tutorProfile = await prisma.tutor.findUnique({ where: { userId: tutorId } });
        if (!tutorProfile) return null; // Or throw error

        const session = await prisma.session.findFirst({
            where: {
                tutorId: tutorProfile.id,
                endTime: null
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        return session;
    }
}

export const sessionService = new SessionService();
