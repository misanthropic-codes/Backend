import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const signup = async (req: Request, res: Response) => {
  const { email, username, password, role } = req.body;
  try {
    // Check for existing user by email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    if (existingUser) {
      res.status(400).json({ error: 'Email or username already in use' });
      return;
    }
    // Stronger password policy (example: min 8 chars, at least 1 number)
    if (!/^.{8,}$/.test(password) || !/\d/.test(password)) {
      res.status(400).json({ error: 'Password must be at least 8 characters and contain a number.' });
      return;
    }
    // Generate a cryptographically secure random id (UUID is default, but for extra randomness, you can use crypto.randomUUID or randomBytes)
    const userId = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 12); // use higher salt rounds
    const user = await prisma.user.create({
      data: { id: userId, email, username, password: hashedPassword, role },
    });
    res.status(201).json({ id: user.id, email: user.email, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }
    // Prevent timing attacks
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }
    // Use short-lived JWTs and avoid exposing sensitive info
    const token = jwt.sign(
      {
        id: user.id, // use 'id' not 'userId' for consistency with your middleware
        email: user.email,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '15m' } // shorter expiry for security
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
