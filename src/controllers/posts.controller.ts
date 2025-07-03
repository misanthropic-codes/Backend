import { Request, Response, NextFunction } from 'express';
import { PostService } from '../services/posts.service';
import { ApiError } from '../utils/apiError';
import { createPostSchema } from '../validators/posts.validator';
import { asyncHandler } from '../utils/asyncHandler';

export const PostsController = {
  createPost: asyncHandler(async function createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.errors[0].message, 'Bad Request');
    }
    const userId = req.user.id;
    try {
      const post = await PostService.createPost(parsed.data, userId);
      res.status(201).json({
        id: post.id,
        content: post.content,
        type: post.type,
        author: {
          id: post.author.id,
          username: post.author.username,
        },
        group: post.group ? { id: post.group.id, name: post.group.name } : null,
        createdAt: post.createdAt,
      });
    } catch (err: any) {
      next(err);
    }
  }),

  getGlobalFeed: asyncHandler(async function getGlobalFeed(req: Request, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const { posts, total } = await PostService.getGlobalFeed(limit, offset);
    res.json({
      total,
      posts: posts.map((p: any) => ({
        id: p.id,
        content: p.content,
        type: p.type,
        author: {
          id: p.author.id,
          username: p.author.username,
        },
        group: p.group ? { id: p.group.id, name: p.group.name } : null,
        createdAt: p.createdAt,
      })),
    });
  }),

  getGroupFeed: asyncHandler(async function getGroupFeed(req: Request, res: Response, next: NextFunction): Promise<void> {
    const groupId = req.params.id;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    try {
      const { posts, total } = await PostService.getGroupFeed(groupId, limit, offset);
      res.json({
        total,
        posts: posts.map((p: any) => ({
          id: p.id,
          content: p.content,
          type: p.type,
          author: {
            id: p.author.id,
            username: p.author.username,
          },
          group: p.group ? { id: p.group.id, name: p.group.name } : null,
          createdAt: p.createdAt,
        })),
      });
    } catch (err: any) {
      next(err);
    }
  }),

  getPostById: asyncHandler(async function getPostById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const postId = req.params.id;
    const post = await PostService.getPostById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found', 'Not Found');
    }
    res.json({
      id: post.id,
      content: post.content,
      type: post.type,
      author: {
        id: post.author.id,
        username: post.author.username,
      },
      group: post.group ? { id: post.group.id, name: post.group.name } : null,
      createdAt: post.createdAt,
    });
  }),

  deletePost: asyncHandler(async function deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
      const deleted = await PostService.deletePost(postId, userId);
      if (!deleted) {
        throw new ApiError(404, 'Post not found', 'Not Found');
      }
      res.json({ message: 'Post deleted successfully' });
    } catch (err: any) {
      if (err.message === 'Forbidden') {
        next(new ApiError(403, 'You are not the author of this post', 'Forbidden'));
        return;
      }
      next(err);
    }
  }),
};
