import mongoose, { Schema, Document } from 'mongoose';
import { Order as IOrder, OrderStatusSchema } from '@repo/shared';

const OrderItemSchemaMongoose = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
}, { _id: false });

const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchemaMongoose],
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true, default: 'cod' },
    status: { type: String, enum: OrderStatusSchema.options, default: 'PENDING' },
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        altPhone: { type: String },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String }, // Make optional/flexible if needed
        zip: { type: String },
        country: { type: String },
        note: { type: String },
    },
    paymentIntentId: { type: String },
    bkashNumber: { type: String },
    bkashTxnId: { type: String },
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
}, { timestamps: true });

export const Order = mongoose.model<IOrder & Document>('Order', OrderSchema);
