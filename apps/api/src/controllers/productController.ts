import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { ProductSchema } from '@repo/shared';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    const category = req.query.category;
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);
    const size = req.query.size;
    const waist = req.query.waist;
    const sort = req.query.sort || 'newest';

    const query: any = {};

    if (req.query.keyword) {
        query.$or = [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { 'variants.size': { $regex: req.query.keyword, $options: 'i' } },
            { 'sizeChart.waist': { $regex: req.query.keyword, $options: 'i' } }
        ];
    }

    if (category) {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (size) {
        query['variants.size'] = size;
    }

    if (waist) {
        query['sizeChart.waist'] = waist;
    }

    if (req.query.hasDiscount === 'true') {
        query.$or = [
            { discountAmount: { $gt: 0 } },
            { discountPercentage: { $gt: 0 } }
        ];
    }

    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
        query.price = {};
        if (!isNaN(minPrice)) query.price.$gte = minPrice;
        if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    // Define sort object
    let sortObj: any = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'oldest') sortObj = { createdAt: 1 };

    const count = await Product.countDocuments(query);

    const products = await Product.find(query)
        .sort(sortObj)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        products,
        page,
        pages: Math.ceil(count / pageSize) || 1,
        total: count
    });
});

// @desc    Fetch single product by slug
// @route   GET /api/v1/products/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Fetch single product by ID
// @route   GET /api/v1/products/details/:id
// @access  Public
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    // Validate with Zod
    const parsed = ProductSchema.parse(req.body);

    // Check if slug exists
    const productExists = await Product.findOne({ slug: parsed.slug });
    if (productExists) {
        res.status(400);
        throw new Error('Product with this slug already exists');
    }

    const product = await Product.create(parsed);
    res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        const parsed = ProductSchema.parse(req.body) as any;

        Object.assign(product, {
            name: parsed.name,
            slug: parsed.slug,
            description: parsed.description,
            highlights: parsed.highlights,
            price: parsed.price,
            comparePrice: parsed.comparePrice,
            discountAmount: parsed.discountAmount || 0,
            discountPercentage: parsed.discountPercentage || 0,
            discountedPrice: parsed.discountedPrice || 0,
            category: parsed.category,
            images: parsed.images,
            variants: parsed.variants,
            sizeChart: parsed.sizeChart,
            isDraft: parsed.isDraft,
        });

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});
