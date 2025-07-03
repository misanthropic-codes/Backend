import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth";
import groupRoutes from "./routes/groups.route";
import postRoutes from "./routes/posts.route";
import { errorHandler } from "./middleware/error.middleware";
import commentsRoutes from './routes/comments.route';
import { helmetMiddleware } from './middlewares/helmet.middleware';
import { compressionMiddleware } from './middlewares/compression.middleware';
import { morganMiddleware } from './middlewares/morgan.middleware';

// Load environment variables
dotenv.config();


const app = express();
app.use(helmetMiddleware);
app.use(compressionMiddleware);
app.use(morganMiddleware);

app.use(express.json());

// Routes


app.use('/auth', authRoutes);



app.use('/groups', groupRoutes);
app.use('/', postRoutes);
app.use('/comments', commentsRoutes);


// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Centralized error handler (should be last)
app.use(errorHandler as any);

export default app;
