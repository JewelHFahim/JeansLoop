import mongoose, { Schema, Document } from 'mongoose';
import { Product as IProduct } from '@repo/shared';

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
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    variants: [ProductVariantSchema],
    isDraft: { type: Boolean, default: false },
}, { timestamps: true });

ProductSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model<IProduct & Document>('Product', ProductSchema);
