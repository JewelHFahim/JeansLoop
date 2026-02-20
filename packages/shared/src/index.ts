import { z } from 'zod';

export const UserRoleSchema = z.enum(["SUPER_ADMIN", "ADMIN", "MANAGER", "SUPPORT", "CUSTOMER"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8).optional(), // Optional for updates/sanitized views
    role: UserRoleSchema.default("CUSTOMER"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const ProductVariantSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    size: z.string(),
    color: z.string(),
    price: z.number().nonnegative(),
    stock: z.number().int().nonnegative(),
});
export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export const ProductSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3),
    slug: z.string(),
    description: z.string(),
    price: z.number().nonnegative(),
    category: z.string(),
    images: z.array(z.string()),
    variants: z.array(ProductVariantSchema),
    isDraft: z.boolean().default(false),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
export type Product = z.infer<typeof ProductSchema>;

export const CategorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2),
    slug: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
export type Category = z.infer<typeof CategorySchema>;

export const CouponSchema = z.object({
    id: z.string().optional(),
    code: z.string().min(3).toUpperCase(),
    type: z.enum(['percentage', 'fixed']),
    value: z.number().positive(),
    minAmount: z.number().nonnegative().default(0),
    expiryDate: z.date(),
    isActive: z.boolean().default(true),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
export type Coupon = z.infer<typeof CouponSchema>;

export const OrderItemSchema = z.object({
    productId: z.string(),
    variantSku: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int().positive(),
    image: z.string().optional(),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderStatusSchema = z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    items: z.array(OrderItemSchema),
    totalAmount: z.number(),
    status: OrderStatusSchema.default("PENDING"),
    shippingAddress: z.object({
        fullName: z.string(),
        phone: z.string(),
        altPhone: z.string().optional(),
        street: z.string(),
        city: z.string(),
        state: z.string().optional(),
        zip: z.string().optional(),
        country: z.string().optional(),
        note: z.string().optional(),
    }),
    paymentIntentId: z.string().optional(),
    bkashNumber: z.string().optional(),
    bkashTxnId: z.string().optional(),
    couponCode: z.string().optional(),
    discountAmount: z.number().default(0),
    isPaid: z.boolean().default(false),
    paidAt: z.date().optional(),
    isDelivered: z.boolean().default(false),
    deliveredAt: z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
export type Order = z.infer<typeof OrderSchema>;
