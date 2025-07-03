
import { Router } from 'express';
import { PostsController } from '../controllers/posts.controller';
import { authenticateJWT } from '../middleware/authenticateJWT';
import { postRateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

router.post('/posts', authenticateJWT, postRateLimiter, PostsController.createPost);
router.get('/posts', PostsController.getGlobalFeed);
router.get('/groups/:id/posts', PostsController.getGroupFeed);
router.get('/posts/:id', PostsController.getPostById);
router.delete('/posts/:id', authenticateJWT, PostsController.deletePost);

export default router;
