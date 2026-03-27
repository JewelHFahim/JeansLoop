import { Request, Response } from 'express';
import { SiteSettings } from '../models/SiteSettings';

// @desc    Get site settings
// @route   GET /api/v1/settings
// @access  Public
export const getSettings = async (_req: Request, res: Response) => {
    let settings = await SiteSettings.findOne();

    if (!settings) {
        // Create default settings if not exists
        settings = await SiteSettings.create({
            title: 'JeansLoop',
            email: 'support@jeansloop.com',
        });
    }

    res.json(settings);
};

// @desc    Update site settings
// @route   PUT /api/v1/settings
// @access  Private/Admin
export const updateSettings = async (req: Request, res: Response) => {
    let settings = await SiteSettings.findOne();

    if (!settings) {
        settings = new SiteSettings(req.body);
    } else {
        // Update fields
        Object.assign(settings, req.body);
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
};
