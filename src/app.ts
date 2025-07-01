import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth";

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default app;
