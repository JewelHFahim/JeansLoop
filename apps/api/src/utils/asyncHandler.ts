import { Request, Response, NextFunction } from 'express';

/**
 * A wrapper for async express routes to catch errors and pass them to the next middleware
 * This prevents "Unhandled Promise Rejections" and centralizes error handling.
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
