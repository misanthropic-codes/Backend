import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      status: err.status,
      error: err.error,
      message: err.message,
    });
  }
  // Fallback for unhandled errors
  return res.status(500).json({
    status: 500,
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
  });
}
