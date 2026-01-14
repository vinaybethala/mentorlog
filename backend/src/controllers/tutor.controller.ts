import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../config/prisma';

export const getStudents = async (req: AuthRequest, res: Response) => {
    try {
        const tutorId = req.user?.id;
        if (!tutorId) return res.status(401).json({ message: 'Unauthorized' });

        // For now, return all students. In future, limit to assigned students.
        const students = await prisma.student.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                parent: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
};
