import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { Role } from '@prisma/client';

// Helper to generate temporary password
const generatePassword = (): string => {
    const length = 8;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const all = uppercase + lowercase + numbers;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    for (let i = 3; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)];
    }

    return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const addTutor = async (req: Request, res: Response) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ message: 'Email and name are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const temporaryPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        const result = await prisma.$transaction(async (tx: any) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: Role.TUTOR
                }
            });

            const tutor = await tx.tutor.create({
                data: {
                    userId: user.id
                }
            });

            return { user, tutor };
        });

        res.status(201).json({
            message: 'Tutor created successfully',
            email,
            temporaryPassword,
            tutorId: result.tutor.id,
            userId: result.user.id
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating tutor', error: error.message });
    }
};

export const enrollStudent = async (req: Request, res: Response) => {
    try {
        const { email, name, parentId } = req.body;

        if (!email || !name) {
            return res.status(400).json({ message: 'Email and name are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Verify parent exists if parentId provided
        if (parentId) {
            const parent = await prisma.parent.findUnique({ where: { id: parentId } });
            if (!parent) {
                return res.status(400).json({ message: 'Parent not found' });
            }
        }

        const temporaryPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        const result = await prisma.$transaction(async (tx: any) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: Role.STUDENT
                }
            });

            const student = await tx.student.create({
                data: {
                    userId: user.id,
                    parentId: parentId || null
                }
            });

            return { user, student };
        });

        res.status(201).json({
            message: 'Student enrolled successfully',
            email,
            temporaryPassword,
            studentId: result.student.id,
            userId: result.user.id
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error enrolling student', error: error.message });
    }
};

export const addParent = async (req: Request, res: Response) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ message: 'Email and name are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const temporaryPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        const result = await prisma.$transaction(async (tx: any) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: Role.PARENT
                }
            });

            const parent = await tx.parent.create({
                data: {
                    userId: user.id
                }
            });

            return { user, parent };
        });

        res.status(201).json({
            message: 'Parent created successfully',
            email,
            temporaryPassword,
            parentId: result.parent.id,
            userId: result.user.id
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating parent', error: error.message });
    }
};

export const getTutors = async (req: Request, res: Response) => {
    try {
        const tutors = await prisma.tutor.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true }
                }
            }
        });
        res.json(tutors);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching tutors', error: error.message });
    }
};

export const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true }
                },
                parent: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                }
            }
        });
        res.json(students);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
};

export const getParents = async (req: Request, res: Response) => {
    try {
        const parents = await prisma.parent.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true }
                },
                students: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            }
        });
        res.json(parents);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching parents', error: error.message });
    }
};
