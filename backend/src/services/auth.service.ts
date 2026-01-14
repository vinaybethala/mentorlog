import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export class AuthService {
    async bootstrapAdmin() {
        console.log('Bootstrapping Admin...');
        const adminEmail = 'admin@mentorlog.com';
        const adminPassword = 'Admin@123';

        try {
            const existingAdmin = await prisma.user.findUnique({
                where: { email: adminEmail }
            });

            if (!existingAdmin) {
                console.log('Admin user not found. Creating...');
                const hashedPassword = await bcrypt.hash(adminPassword, 10);

                await prisma.user.create({
                    data: {
                        email: adminEmail,
                        password: hashedPassword,
                        name: 'System Admin',
                        role: Role.ADMIN // Ensure this matches Prisma Enum
                    }
                });
                console.log('Admin created successfully.');
            } else {
                console.log('Admin user already exists.');
                // Optional: Reset password if needed, but for now just skip
            }
        } catch (error) {
            console.error('Error bootstrapping admin:', error);
        }
    }

    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: '30d' } // Longer expiry for mobile apps
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            role: user.role
        };
    }
}

export const authService = new AuthService();
