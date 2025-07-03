import { PrismaClient } from '@prisma/client';
import { CreatePostDTO } from '../types/post';

const prisma = new PrismaClient();

export const PostService = {
  async createPost(data: CreatePostDTO, authorId: string) {
    return prisma.post.create({
      data: {
        content: data.content,
        type: data.type,
        groupId: data.groupId,
        authorId,
      },
      include: {
        author: true,
        group: true,
      },
    });
  },

  async getGlobalFeed(limit: number, offset: number) {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          group: true,
        },
      }),
      prisma.post.count(),
    ]);
    return { posts, total };
  },

  async getGroupFeed(groupId: string, limit: number, offset: number) {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { groupId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          group: true,
        },
      }),
      prisma.post.count({ where: { groupId } }),
    ]);
    return { posts, total };
  },

  async getPostById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        group: true,
      },
    });
  },

  async deletePost(id: string, userId: string) {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return null;
    if (post.authorId !== userId) throw new Error('Forbidden');
    return prisma.post.delete({ where: { id } });
  },
};
