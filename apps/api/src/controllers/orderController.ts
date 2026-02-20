import { Request, Response } from 'express';
import { Order } from '../models/Order';

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const addOrderItems = async (req: Request, res: Response) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        couponCode,
        discountAmount,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        // Ideally verify prices from DB here
        const order = new Order({
            userId: (req as any).user.userId,
            items: orderItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalAmount: totalPrice,
            shippingAddress,
            paymentMethod: paymentMethod || 'cod',
            bkashNumber: req.body.bkashNumber,
            bkashTxnId: req.body.bkashTxnId,
            couponCode,
            discountAmount,
            paymentIntentId: '',
        });

        const createdOrder = await order.save();

        res.status(201).json({
            order: createdOrder
        });
    }
};

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

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = new Date();
        order.status = 'DELIVERED';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};
