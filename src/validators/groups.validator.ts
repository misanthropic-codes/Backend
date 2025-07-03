import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters long'),
  description: z.string().min(1, 'Description is required'),
});

export const groupIdParamSchema = z.object({
  id: z.string().uuid('Invalid group ID'),
});
