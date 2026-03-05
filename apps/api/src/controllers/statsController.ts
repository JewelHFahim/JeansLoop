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

    // Total Sales (Delivered Only)
    const sales = await Order.aggregate([
        { $match: { status: 'DELIVERED' } },
        { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
    ]);
    const totalSales = sales.length > 0 ? sales[0].totalSales : 0;

    // Sales History (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesHistory = await Order.aggregate([
        {
            $match: {
                status: 'DELIVERED',
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                totalSales: { $sum: "$totalAmount" },
                orderCount: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // Order Status Distribution
    const orderStatusDistribution = await Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Recent Orders
    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email');

    // Top Selling Products
    const topProducts = await Order.aggregate([
        { $match: { status: 'DELIVERED' } },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.productId",
                name: { $first: "$items.name" },
                quantity: { $sum: "$items.quantity" },
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
            }
        },
        { $sort: { quantity: -1 } },
        { $limit: 5 }
    ]);

    res.json({
        totalProducts,
        totalUsers,
        totalOrders,
        totalSales,
        salesHistory,
        orderStatusDistribution,
        recentOrders,
        topProducts
    });
};
