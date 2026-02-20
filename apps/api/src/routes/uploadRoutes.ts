import express from 'express';
import { uploadFile } from '../controllers/uploadController';
import { upload } from '../utils/fileUpload';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), uploadFile as any);

export default router;
