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
    category: { type: String, required: true },
    images: [{ type: String }],
    variants: [ProductVariantSchema],
    sizeChart: [SizeChartRowSchema],
    isDraft: { type: Boolean, default: false },
}, { timestamps: true });

ProductSchema.index({ name: 'text', description: 'text' });

export interface IProductDocument extends Omit<IProduct, 'id'>, Document {}

export const Product = mongoose.model<IProductDocument>('Product', ProductSchema);
