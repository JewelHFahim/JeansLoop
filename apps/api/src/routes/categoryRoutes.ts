import express from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getCategories)
    .post(protect, admin, createCategory);

router.route('/:id')
    .get(getCategory)
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

export default router;
