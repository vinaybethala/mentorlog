import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const bootstrapAdmin = async () => {
    try {
        const adminEmail = 'admin@mentorlog.com';
        const adminPassword = 'Admin@123';

        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await prisma.user.create({
                data: {
                    name: 'System Admin',
                    email: adminEmail,
                    password: hashedPassword,
                    role: Role.ADMIN
                }
            });
            console.log('Admin ready');
        } else {
            console.log('Admin already exists. Updating password to ensure access...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await prisma.user.update({
                where: { email: adminEmail },
                data: {
                    password: hashedPassword,
                    role: Role.ADMIN // Ensure role is correct too
                }
            });
            console.log('Admin password updated.');
        }
    } catch (error) {
        console.error('Bootstrap error:', error);
    }
};
