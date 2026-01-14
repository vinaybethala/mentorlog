import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const result = await authService.login(email, password);
        res.json(result);
    } catch (error: any) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};
