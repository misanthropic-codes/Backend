import { PrismaClient } from '@prisma/client';
import { CreateCommentDTO } from '../validators/comments.validator';
import { ApiError } from '../utils/apiError';

const prisma = new PrismaClient();

export async function createComment({ content, postId, parentId, authorId }: CreateCommentDTO & { authorId: string }) {
  // Optionally: check if post exists, parentId (if provided) exists and belongs to same post
  return prisma.comment.create({
    data: {
      content,
      postId,
      parentId,
      authorId,
    },
  });
}

// Recursive function to build nested comment tree
function nestComments(comments: any[], parentId: string | null = null): any[] {
  return comments
    .filter((c) => c.parentId === parentId)
    .map((c) => ({
      ...c,
      replies: nestComments(comments, c.id),
    }));
}

export async function getCommentsByPost(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
  });
  return nestComments(comments);
}

export async function deleteComment(commentId: string, userId: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (comment.authorId !== userId) throw new ApiError(403, 'Not authorized');
  await prisma.comment.delete({ where: { id: commentId } });
}
