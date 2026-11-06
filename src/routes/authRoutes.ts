import { Router } from 'express';
import { register, login, getCurrentUser, getCsrfToken, logout } from '../controllers/authController';

const router = Router();

router.get('/csrf-token', getCsrfToken);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getCurrentUser);

export default router;