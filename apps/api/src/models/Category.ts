import mongoose, { Schema, Document } from 'mongoose';
import { Category as ICategory } from '@repo/shared';

const CategorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
}, { timestamps: true });

export const Category = mongoose.model<ICategory & Document>('Category', CategorySchema);
