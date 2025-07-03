import { PrismaClient } from '@prisma/client';
import { CreateGroupDTO } from '../types/group';

const prisma = new PrismaClient();

export const GroupService = {
  async createGroup(data: CreateGroupDTO, userId: string) {
    return prisma.group.create({
      data: {
        ...data,
        members: { connect: { id: userId } },
      },
      include: { members: true },
    });
  },

  async getGroups(limit: number, offset: number) {
    const [groups, total] = await Promise.all([
      prisma.group.findMany({
        skip: offset,
        take: limit,
        include: { members: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.group.count(),
    ]);
    return { groups, total };
  },

  async getGroupById(id: string) {
    return prisma.group.findUnique({
      where: { id },
      include: { members: true },
    });
  },

  async joinGroup(groupId: string, userId: string) {
    return prisma.group.update({
      where: { id: groupId },
      data: { members: { connect: { id: userId } } },
      include: { members: true },
    });
  },

  async leaveGroup(groupId: string, userId: string) {
    return prisma.group.update({
      where: { id: groupId },
      data: { members: { disconnect: { id: userId } } },
      include: { members: true },
    });
  },
};
