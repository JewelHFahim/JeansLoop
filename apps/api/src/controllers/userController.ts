import { Request, Response } from 'express';
import { User } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById((req as any).user.userId);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            gender: user.gender,
            birthDate: user.birthDate,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    // If updating password, explicitly select the password field (it's select: false)
    const userQuery = req.body.password
        ? User.findById((req as any).user.userId).select('+password')
        : User.findById((req as any).user.userId);

    const user = await userQuery;

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.gender = req.body.gender || user.gender;
    user.birthDate = req.body.birthDate !== undefined ? req.body.birthDate : user.birthDate;

    if (req.body.password) {
        if (!req.body.currentPassword) {
            res.status(400);
            throw new Error('Current password is required to set a new password.');
        }
        const isMatch = await user.comparePassword(req.body.currentPassword);
        if (!isMatch) {
            res.status(400);
            throw new Error('Current password is incorrect.');
        }
        user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        gender: updatedUser.gender,
        birthDate: updatedUser.birthDate,
        role: updatedUser.role,
    });
});

// @desc    Get all users with order stats
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
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
            $sort: { createdAt: -1 }
        },
        {
            $project: {
                password: 0,
                orders: 0
            }
        }
    ]);
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
