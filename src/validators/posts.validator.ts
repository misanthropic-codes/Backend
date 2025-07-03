import { z } from 'zod';
import { PostType } from '../types/post';

export const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  type: z.nativeEnum(PostType),
  groupId: z.string().uuid().optional(),
});

export type CreatePostDTO = z.infer<typeof createPostSchema>;
