import mongoose, { Schema, Document } from 'mongoose';
import { Coupon as ICoupon } from '@repo/shared';

const CouponSchema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    minAmount: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Coupon = mongoose.model<ICoupon & Document>('Coupon', CouponSchema);
