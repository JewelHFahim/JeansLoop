import express from 'express';
import { registerUser, loginUser, logoutUser, refreshToken } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.post('/logout', logoutUser);
router.get('/refresh', refreshToken);

export default router;
