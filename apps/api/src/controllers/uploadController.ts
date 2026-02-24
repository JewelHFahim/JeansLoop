import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const storageType = process.env.STORAGE_TYPE || 'LOCAL';

    if (storageType === 'CLOUDINARY') {
        const uploadFromBuffer = (buffer: Buffer) => {
            return new Promise((resolve, reject) => {
                const cld_upload_stream = cloudinary.uploader.upload_stream(
                    { folder: 'ecommerce' },
                    (error: any, result: any) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(buffer).pipe(cld_upload_stream);
            });
        };

        try {
            const result: any = await uploadFromBuffer(req.file.buffer);
            res.json({
                message: 'Image uploaded',
                image: result.secure_url,
                url: result.secure_url,
            });
        } catch (error) {
            res.status(500);
            throw new Error('Cloudinary upload failed');
        }

    } else {
        // Local Storage
        const __dirname = path.resolve();
        const uploadDir = path.join(__dirname, 'apps/api/public/uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = `${Date.now()}-${req.file.originalname.replace(/ /g, '_')}`;
        const filePath = path.join(uploadDir, filename);

        fs.writeFile(filePath, req.file.buffer, (err) => {
            if (err) {
                res.status(500);
                throw new Error('File upload failed');
            }

            const host = req.get('host');
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;
            const fallbackUrl = host ? `${protocol}://${host}` : `http://localhost:${process.env.PORT || 5000}`;
            const backendUrl = process.env.BACKEND_URL || fallbackUrl;
            const fileUrl = `${backendUrl}/uploads/${filename}`;
            res.json({
                message: 'Image uploaded',
                image: fileUrl,
                url: fileUrl,
            });
        });
    }
};
