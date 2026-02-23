import { Request, Response } from 'express';

import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, sendRefreshToken } from '../utils/jwt';
import { UserSchema } from '@repo/shared'; // validation schema
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
    try {
        // Validate request
        const parsed = UserSchema.parse(req.body);
        const { name, email, password } = parsed;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password, // Pre-save hook will hash it
        });

        if (user) {
            sendRefreshToken(res, generateRefreshToken(user._id.toString()));
            const accessToken = generateAccessToken(user._id.toString(), user.role);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: accessToken
            });
        } else {
            return res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        // Handle Zod validation errors or other issues
        if (error.issues) {
            return res.status(400).json({ message: error.issues.map((issue: any) => issue.message).join(', ') });
        }
        return res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt for:', email);

        const user = await User.findOne({ email }).select('+password');

        console.log('User found:', user ? 'Yes' : 'No');
        if (user) {
            console.log('User email:', user.email);
            console.log('Password from DB exists:', !!user.password);
        }

        if (user && (await (user as any).comparePassword(password))) {
            console.log('Password match: Yes');
            sendRefreshToken(res, generateRefreshToken(user._id.toString()));
            const accessToken = generateAccessToken(user._id.toString(), user.role);

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: accessToken
            });
        } else {
            console.log('Password match: No');
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        console.error('Login error:', error);
        return res.status(500).json({ message: error.message });
    }
};

export const logoutUser = (_req: Request, res: Response) => {
    res.cookie('refresh_token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refresh_token;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no refresh token' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const accessToken = generateAccessToken(user._id.toString(), user.role);
        // Optionally rotate refresh token here

        res.json({ token: accessToken });
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
