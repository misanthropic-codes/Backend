import { Router } from 'express';
import * as commentsController from '../controllers/comments.controller';
import { authenticateJWT } from '../middleware/authenticateJWT';
import { validate } from '../middleware/validation';
import { createCommentSchema } from '../validators/comments.validator';

const router = Router();

router.post(
  '/',
  authenticateJWT,
  validate(createCommentSchema),
  commentsController.createComment
);

router.get(
  '/post/:postId',
  commentsController.getCommentsByPost
);

router.delete(
  '/:commentId',
  authenticateJWT,
  commentsController.deleteComment
);

export default router;
