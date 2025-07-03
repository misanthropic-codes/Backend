import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth";
import groupRoutes from "./routes/groups.route";
import { errorHandler } from "./middleware/error.middleware";

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());

// Routes

app.use('/auth', authRoutes);
app.use('/groups', groupRoutes);


// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Centralized error handler (should be last)
app.use(errorHandler as any);

export default app;
