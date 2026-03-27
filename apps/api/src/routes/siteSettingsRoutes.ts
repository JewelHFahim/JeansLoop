import express from 'express';
import { getSettings, updateSettings } from '../controllers/siteSettingsController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getSettings)
    .put(protect, admin, updateSettings);

export default router;
