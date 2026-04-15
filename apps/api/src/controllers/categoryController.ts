import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { CategorySchema } from '@repo/shared';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await Category.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(categories);
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.status(200).json(category);
});

// @desc    Create a category
// @route   POST /api/v1/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = CategorySchema.parse(req.body);
    const category = new Category(validatedData);
    await category.save();
    res.status(201).json(category);
});

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = CategorySchema.parse(req.body);
    const category = await Category.findById(req.params.id);
    
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    Object.assign(category, validatedData);
    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
});

// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    await category.deleteOne();
    res.status(200).json({ message: 'Category deleted successfully' });
});
