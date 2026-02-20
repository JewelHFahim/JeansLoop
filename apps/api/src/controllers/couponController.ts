import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon';
import { CouponSchema } from '@repo/shared';

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
export const getCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single coupon
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
export const getCouponById = async (req: Request, res: Response) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            res.json(coupon);
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin
export const createCoupon = async (req: Request, res: Response) => {
    try {
        const validatedData = CouponSchema.parse({
            ...req.body,
            expiryDate: new Date(req.body.expiryDate)
        });

        const couponExists = await Coupon.findOne({ code: validatedData.code });
        if (couponExists) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const coupon = await Coupon.create(validatedData);
        res.status(201).json(coupon);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req: Request, res: Response) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            const validatedData = CouponSchema.parse({
                ...req.body,
                expiryDate: new Date(req.body.expiryDate)
            });

            Object.assign(coupon, validatedData);
            const updatedCoupon = await coupon.save();
            res.json(updatedCoupon);
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            await coupon.deleteOne();
            res.json({ message: 'Coupon removed' });
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate a coupon
// @route   POST /api/v1/coupons/validate
// @access  Public
export const validateCoupon = async (req: Request, res: Response) => {
    const { code, amount } = req.body;
    try {
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        if (new Date() > coupon.expiryDate) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (amount < coupon.minAmount) {
            return res.status(400).json({ message: `Minimum amount for this coupon is ৳${coupon.minAmount}` });
        }

        let discount = 0;
        if (coupon.type === 'percentage') {
            discount = (amount * coupon.value) / 100;
        } else {
            discount = coupon.value;
        }

        res.json({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            discountAmount: Math.min(discount, amount)
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
