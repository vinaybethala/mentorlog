// src/services/leave.service.ts
import { PrismaClient, LeaveStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class LeaveService {
    /**
     * Tutor applies for leave.
     */
    async applyForLeave(tutorId: string, startDate: Date, endDate: Date, reason: string) {
        // Mocking creation
        // return await prisma.leave.create({
        //   data: { tutorId, startDate, endDate, reason, status: 'PENDING' }
        // });

        return {
            id: 'mock-leave-id',
            tutorId,
            startDate,
            endDate,
            reason,
            status: 'PENDING',
            createdAt: new Date()
        };
    }

    /**
     * Admin approves or rejects leave.
     */
    async updateLeaveStatus(leaveId: string, adminId: string, status: LeaveStatus) {
        // Mocking status update
        // return await prisma.leave.update({
        //   where: { id: leaveId },
        //   data: { status, approvedById: adminId }
        // });

        return {
            id: leaveId,
            status,
            approvedById: adminId,
            updatedAt: new Date()
        };
    }

    /**
     * Gets leave history (for tutor or admin).
     */
    async getLeaveHistory(tutorId?: string) {
        // Mocking retrieval
        return [
            {
                id: 'mock-leave-1',
                tutorId: tutorId || 'some-tutor-id',
                startDate: new Date(),
                endDate: new Date(),
                reason: 'Vacation',
                status: 'APPROVED'
            }
        ];
    }
}

export const leaveService = new LeaveService();
