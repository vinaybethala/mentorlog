import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import sessionRoutes from './routes/session.routes';
import notificationRoutes from './routes/notification.routes';
import attendanceRoutes from './routes/attendance.routes';
import leaveRoutes from './routes/leave.routes';
import reportRoutes from './routes/report.routes';
import studentRoutes from './routes/student.routes';
import parentRoutes from './routes/parent.routes';
import tutorRoutes from './routes/tutor.routes';
import adminRoutes from './routes/admin.routes';
import { bootstrapAdmin } from './config/bootstrap';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/admin', adminRoutes);




import { errorHandler } from './middlewares/error.middleware';

// ... other middleware ...

app.get('/', (req: Request, res: Response) => {
    res.send('MentorLog API running');
});

// Register Global Error Handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', async () => {
    await bootstrapAdmin(); // Keep bootstrapAdmin call
    console.log(`Server is running on port ${PORT}`);
    console.log(`API accessible at http://0.0.0.0:${PORT}/api`);
});
