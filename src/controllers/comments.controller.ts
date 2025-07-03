import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/comments.service';
import { createCommentSchema } from '../validators/comments.validator';
import { ApiError } from '../utils/apiError';

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, postId, parentId } = createCommentSchema.parse(req.body);
    const userId = req.user.id;
    const comment = await commentService.createComment({ content, postId, parentId, authorId: userId });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const getCommentsByPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const comments = await commentService.getCommentsByPost(postId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    await commentService.deleteComment(commentId, userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
