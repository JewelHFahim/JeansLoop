import express from 'express';
import { getProducts, getProductBySlug, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct as any);

router.route('/details/:id')
    .get(getProductById);

router.route('/:slug')
    .get(getProductBySlug);

router.route('/:id')
    .put(protect, admin, updateProduct as any)
    .delete(protect, admin, deleteProduct as any);

export default router;
