import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { ProductSchema } from '@repo/shared';

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
    try {
        const pageSize = Number(req.query.limit) || 12;
        const page = Number(req.query.page) || 1;
        const category = req.query.category;
        const minPrice = Number(req.query.minPrice);
        const maxPrice = Number(req.query.maxPrice);
        const sort = req.query.sort || 'newest';

        const query: any = {};

        if (req.query.keyword) {
            query.name = {
                $regex: req.query.keyword,
                $options: 'i',
            };
        }

        if (category) {
            // Using case-insensitive regex for category
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
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
    } catch (error: any) {
        console.error('Error in getProducts:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product by slug
// @route   GET /api/v1/products/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product by ID
// @route   GET /api/v1/products/details/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
    try {
        // Validate with Zod
        const parsed = ProductSchema.parse(req.body);

        // Check if slug exists
        const productExists = await Product.findOne({ slug: parsed.slug });
        if (productExists) {
            return res.status(400).json({ message: 'Product with this slug already exists' });
        }

        const product = await Product.create(parsed);
        res.status(201).json(product);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: 'Validation Error',
                errors: error.errors.map((e: any) => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const parsed = ProductSchema.parse(req.body);

            product.name = parsed.name;
            product.slug = parsed.slug;
            product.description = parsed.description;
            product.price = parsed.price;
            product.category = parsed.category;
            product.images = parsed.images;
            product.variants = parsed.variants;
            product.isDraft = parsed.isDraft;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: 'Validation Error',
                errors: error.errors.map((e: any) => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
