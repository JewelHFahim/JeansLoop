import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateAccessToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'access_secret', { expiresIn: '24h' });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: '7d' });
};

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie('refresh_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/v1/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};
