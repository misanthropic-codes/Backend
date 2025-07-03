import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  postId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
});

export type CreateCommentDTO = z.infer<typeof createCommentSchema>;
