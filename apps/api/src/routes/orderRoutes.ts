import express from 'express';
import {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToPaid,
    updateOrderToDelivered
} from '../controllers/orderController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
    .post(protect, addOrderItems as any)
    .get(protect, admin, getOrders as any);

router.route('/myorders').get(protect, getMyOrders as any);

router.route('/:id').get(protect, getOrderById as any);

router.route('/:id/pay').put(protect, admin, updateOrderToPaid as any);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered as any);

export default router;
