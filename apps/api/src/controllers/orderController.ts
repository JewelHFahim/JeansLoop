import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Coupon } from '../models/Coupon';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req: Request, res: Response) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice: clientTotalPrice,
        couponCode,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // 1. Verify every item's price from DB
    let calculatedItemsPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
        const product = await Product.findById(item.productId);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.name}`);
        }

        // Find the variant price if it exists, otherwise use base price
        // Note: Our current model has base price on product. We should ensure it matches.
        const dbPrice = product.price; 
        
        calculatedItemsPrice += dbPrice * item.quantity;
        
        verifiedOrderItems.push({
            ...item,
            price: dbPrice // Force DB price
        });
    }

    // 2. Verify Coupon and Discount if applicable
    let calculatedDiscountAmount = 0;
    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
        if (coupon && new Date() <= coupon.expiryDate && calculatedItemsPrice >= coupon.minAmount) {
            if (coupon.type === 'percentage') {
                calculatedDiscountAmount = (calculatedItemsPrice * coupon.value) / 100;
            } else {
                calculatedDiscountAmount = coupon.value;
            }
            calculatedDiscountAmount = Math.min(calculatedDiscountAmount, calculatedItemsPrice);
        } else if (couponCode !== "") {
            // If they sent a code but it's invalid
            res.status(400);
            throw new Error('Invalid or expired coupon code');
        }
    }

    // 3. Final Total Verification
    const calculatedTotal = calculatedItemsPrice + shippingPrice + taxPrice - calculatedDiscountAmount;

    // We allow a small margin for rounding or legitimate reasons if needed, 
    // but usually in local currency like BDT we expect exact match.
    if (Math.abs(calculatedTotal - clientTotalPrice) > 1) {
        res.status(400);
        throw new Error(`Price mismatch detected. Server: ${calculatedTotal}, Client: ${clientTotalPrice}`);
    }

    const order = new Order({
        userId: (req as any).user.userId,
        items: verifiedOrderItems,
        itemsPrice: calculatedItemsPrice,
        shippingPrice,
        taxPrice,
        totalAmount: calculatedTotal,
        shippingAddress,
        paymentMethod: paymentMethod || 'cod',
        bkashNumber: req.body.bkashNumber,
        bkashTxnId: req.body.bkashTxnId,
        couponCode,
        discountAmount: calculatedDiscountAmount,
        paymentIntentId: '',
    });

    const createdOrder = await order.save();
    res.status(201).json({ order: createdOrder });
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (order) {
        // Check if admin or owner
        if ((req as any).user.role === 'ADMIN' || (req as any).user.role === 'SUPER_ADMIN' || (order.userId as any)._id?.toString() === (req as any).user.userId) {
            res.json(order);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: (req as any).user.userId });
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getOrders = async (req: Request, res: Response) => {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword;

    let query: any = {};

    if (keyword) {
        const searchRegex = { $regex: keyword, $options: 'i' };

        query.$or = [
            { 'shippingAddress.fullName': searchRegex },
            { 'shippingAddress.phone': searchRegex },
            { 'status': searchRegex }
        ];

        // Partial ID search (matching the last part or whole string)
        if (typeof keyword === 'string') {
            query.$or.push({
                $expr: {
                    $regexMatch: {
                        input: { $toString: "$_id" },
                        regex: keyword,
                        options: "i"
                    }
                }
            });
        }
    }

    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .populate('userId', 'id name')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
};
// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private/Admin
export const updateOrderToPaid = async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        // Payment info would come from gateway in a real app
        // order.paymentResult = { ... } 

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Update order status with stock management
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.status === 'CANCELLED') {
            res.status(400).json({ message: 'Order is cancelled and cannot be modified in status' });
            return;
        }

        if (order.status === 'DELIVERED' && status !== 'EXCHANGE' && status !== 'DELIVERED') {
            res.status(400).json({ message: 'Delivered orders can only be transitioned to EXCHANGE' });
            return;
        }

        // Handle Stock Management with Safety Checks
        if (status === 'ACCEPTED' && order.stockStatus === 'PENDING') {
            // Deduct stock
            for (const item of order.items) {
                const stockUpdate = await Product.updateOne(
                    { 
                        _id: item.productId, 
                        'variants.size': item.size,
                        'variants.stock': { $gte: item.quantity } // Loophole fix: Check stock sufficiency
                    },
                    { $inc: { 'variants.$.stock': -item.quantity } }
                );

                if (stockUpdate.modifiedCount === 0) {
                    res.status(400);
                    throw new Error(`Insufficient stock for ${item.name} (${item.size}) or product missing.`);
                }
            }
            order.stockStatus = 'ADJUSTED';
        } else if (status === 'CANCELLED' && order.stockStatus === 'ADJUSTED') {
            // Restore stock
            for (const item of order.items) {
                await Product.updateOne(
                    { _id: item.productId, 'variants.size': item.size },
                    { $inc: { 'variants.$.stock': item.quantity } }
                );
            }
            order.stockStatus = 'RESTORED';
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = new Date();
        order.status = 'DELIVERED';
        order.isPaid = true;

        // Ensure stock is adjusted if it skipped ACCEPTED status
        if (order.stockStatus === 'PENDING') {
            for (const item of order.items) {
                await Product.updateOne(
                    { 
                        _id: item.productId, 
                        variants: { $elemMatch: item.size ? { sku: item.variantSku, size: item.size } : { sku: item.variantSku } }
                    },
                    { $inc: { 'variants.$.stock': -item.quantity } }
                );
            }
            order.stockStatus = 'ADJUSTED';
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Delete order
// @route   DELETE /api/v1/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        await order.deleteOne();
        res.json({ message: 'Order removed' });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Update order details (address and amounts)
// @route   PUT /api/v1/orders/:id/details
// @access  Private/Admin
export const updateOrderDetails = async (req: Request, res: Response) => {
    const { shippingAddress, exchangeAmount, totalAmount, bkashNumber, bkashTxnId } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.status === 'CANCELLED') {
            res.status(400).json({ message: 'Order is cancelled and cannot be modified' });
            return;
        }
        
        let detailsChanged = [];

        if (shippingAddress) {
            order.shippingAddress = shippingAddress;
            detailsChanged.push('shipping address');
        }
        
        if (exchangeAmount !== undefined) {
            order.exchangeAmount = exchangeAmount;
            detailsChanged.push('exchange amount');
        }

        if (totalAmount !== undefined) {
            order.totalAmount = totalAmount;
            detailsChanged.push('total amount');
        }

        if (bkashNumber !== undefined) {
            order.bkashNumber = bkashNumber;
            detailsChanged.push('bkash number');
        }

        if (bkashTxnId !== undefined) {
            order.bkashTxnId = bkashTxnId;
            detailsChanged.push('bkash txn id');
        }

        if (detailsChanged.length > 0) {
            order.auditLogs.push({
                action: 'UPDATED_DETAILS',
                adminId: (req as any).user.userId,
                details: `Updated ` + detailsChanged.join(', ')
            });
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};
