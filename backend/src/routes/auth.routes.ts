import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

// router.post('/signup', signup); // Removed public signup
router.post('/login', login);

export default router;
