import express from 'express';
import { getUserProfile, updateUserProfile, getUsers, deleteUser } from '../controllers/userController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/profile')
    .get(protect, getUserProfile as any)
    .put(protect, updateUserProfile as any);

router.route('/')
    .get(protect, admin, getUsers as any);

router.route('/:id')
    .delete(protect, admin, deleteUser as any);

export default router;
