import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['TRADER', 'LEARNER', 'ANALYST', 'EXPERT'])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const validateSignup = (req: Request, res: Response, next: NextFunction) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ error: err.errors });
  }
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ error: err.errors });
  }
};
