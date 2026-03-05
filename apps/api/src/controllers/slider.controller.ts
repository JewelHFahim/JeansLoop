import { Request, Response } from 'express';
import { SliderModel } from '../models/Slider';
import { SliderSchema } from '@repo/shared';

// Get all sliders (public for storefront, active only)
export const getActiveSliders = async (_req: Request, res: Response) => {
    try {
        const sliders = await SliderModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, count: sliders.length, data: sliders });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get all sliders (admin, includes inactive)
export const getAllSliders = async (_req: Request, res: Response) => {
    try {
        const sliders = await SliderModel.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, count: sliders.length, data: sliders });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get single slider
export const getSlider = async (req: Request, res: Response) => {
    try {
        const slider = await SliderModel.findById(req.params.id);
        if (!slider) {
            return res.status(404).json({ success: false, error: 'Slider not found' });
        }
        res.json({ success: true, data: slider });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Create new slider
export const createSlider = async (req: Request, res: Response) => {
    try {
        const validation = SliderSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validation.error.errors,
            });
        }

        const slider = await SliderModel.create(validation.data);
        res.status(201).json({ success: true, data: slider });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update slider
export const updateSlider = async (req: Request, res: Response) => {
    try {
        const validation = SliderSchema.partial().safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validation.error.errors,
            });
        }

        const slider = await SliderModel.findByIdAndUpdate(req.params.id, validation.data, {
            new: true,
            runValidators: true,
        });

        if (!slider) {
            return res.status(404).json({ success: false, error: 'Slider not found' });
        }

        res.json({ success: true, data: slider });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete slider
export const deleteSlider = async (req: Request, res: Response) => {
    try {
        const slider = await SliderModel.findByIdAndDelete(req.params.id);

        if (!slider) {
            return res.status(404).json({ success: false, error: 'Slider not found' });
        }

        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
