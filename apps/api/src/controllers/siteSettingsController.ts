import { Request, Response } from 'express';
import { SiteSettings } from '../models/SiteSettings';

// @desc    Get site settings
// @route   GET /api/v1/settings
// @access  Public
export const getSettings = async (_req: Request, res: Response) => {
    try {
        let settings = await SiteSettings.findOne();

        if (!settings) {
            // Create default settings if not exists
            settings = await SiteSettings.create({
                title: 'JeansLoop',
                email: 'support@jeansloop.com',
            });
        }

        res.json(settings);
    } catch (error: any) {
        console.error('Error in getSettings:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update site settings
// @route   PUT /api/v1/settings
// @access  Private/Admin
export const updateSettings = async (req: Request, res: Response) => {
    try {
        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = new SiteSettings(req.body);
        } else {
            // Update fields
            Object.assign(settings, req.body);
        }

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error: any) {
        console.error('Error in updateSettings:', error);
        res.status(500).json({ message: error.message });
    }
};
