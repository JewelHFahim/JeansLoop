import mongoose, { Document, Schema } from 'mongoose';
import { Slider } from '@repo/shared';

export interface ISliderDocument extends Omit<Slider, 'id'>, Document {
    id: string;
}

const SliderSchema = new Schema<ISliderDocument>(
    {
        image: { type: String, required: true },
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        primaryCta: {
            text: { type: String },
            href: { type: String },
        },
        secondaryCta: {
            text: { type: String },
            href: { type: String },
        },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export const SliderModel = mongoose.model<ISliderDocument>('Slider', SliderSchema);
