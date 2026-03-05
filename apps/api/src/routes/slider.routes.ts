import express from 'express';
import {
    getActiveSliders,
    getAllSliders,
    getSlider,
    createSlider,
    updateSlider,
    deleteSlider,
} from '../controllers/slider.controller';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.get('/active', getActiveSliders);

// Protected Admin routes
router.use(protect);
router.use(admin);

router.route('/')
    .get(getAllSliders)
    .post(createSlider);

router.route('/:id')
    .get(getSlider)
    .put(updateSlider)
    .delete(deleteSlider);

export default router;
