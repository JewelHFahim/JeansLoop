import express from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', protect, admin, getDashboardStats as any);

export default router;
