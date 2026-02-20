import { Request, Response } from 'express';
import { User } from '../models/User';

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
    const user = await User.findById((req as any).user.userId);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
    const user = await User.findById((req as any).user.userId);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        // user.email = req.body.email || user.email; // Should verify email change?
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Get all users with order stats
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = async (_req: Request, res: Response) => {
    const users = await User.aggregate([
        {
            $lookup: {
                from: 'orders',
                localField: '_id',
                foreignField: 'userId',
                as: 'orders'
            }
        },
        {
            $addFields: {
                totalOrders: { $size: '$orders' },
                totalSpent: { $sum: '$orders.totalAmount' },
                phone: { $ifNull: ['$phone', { $arrayElemAt: ['$orders.shippingAddress.phone', 0] }] }
            }
        },
        {
            $project: {
                password: 0,
                orders: 0
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);
    res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};
