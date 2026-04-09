import mongoose, { Schema, Document } from 'mongoose';
import { Product as IProduct } from '@repo/shared';

const SizeChartRowSchema = new Schema({
    waist: { type: String, required: true },
    thigh: { type: String, required: true },
    legOpening: { type: String, required: true },
    long: { type: String, required: true },
}, { _id: false });

const ProductVariantSchema = new Schema({
    sku: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
}, { _id: false });

const ProductSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    price: { type: Number, required: true },
    comparePrice: { type: Number, default: undefined },
    discountAmount: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    discountedPrice: { type: Number, default: 0 },
    category: { type: String, required: true },
    images: [{ type: String }],
    variants: [ProductVariantSchema],
    sizeChart: [SizeChartRowSchema],
    isDraft: { type: Boolean, default: false },
}, { timestamps: true });

ProductSchema.pre('save', function (next) {
    let finalPrice = this.price;

    if (this.discountAmount && this.discountAmount > 0) {
        finalPrice = this.price - this.discountAmount;
    } else if (this.discountPercentage && this.discountPercentage > 0) {
        finalPrice = this.price - (this.price * (this.discountPercentage / 100));
    }

    // Ensure final price is not negative
    this.discountedPrice = Math.max(0, finalPrice);

    next();
});

ProductSchema.index({ name: 'text', description: 'text' });

export interface IProductDocument extends Omit<IProduct, 'id'>, Document {}

export const Product = mongoose.model<IProductDocument>('Product', ProductSchema);
