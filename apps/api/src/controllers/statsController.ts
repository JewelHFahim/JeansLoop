import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { User } from '../models/User';

// @desc    Get dashboard stats
// @route   GET /api/v1/stats
// @access  Private/Admin
export const getDashboardStats = async (_req: Request, res: Response) => {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const sales = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: '$totalAmount' }
            }
        }
    ]);

    const totalSales = sales.length > 0 ? sales[0].totalSales : 0;

    res.json({
        totalProducts,
        totalUsers,
        totalOrders,
        totalSales
    });
};
