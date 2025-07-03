import { Request, Response, NextFunction } from 'express';
import { GroupService } from '../services/groups.service';
import { ApiError } from '../utils/apiError';
import { createGroupSchema, groupIdParamSchema } from '../validators/groups.validator';
import { asyncHandler } from '../utils/asyncHandler';




export const GroupsController = {
  createGroup: asyncHandler(async function createGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = createGroupSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.errors[0].message, 'Bad Request');
    }
    const userId = req.user.id;
    try {
      const group = await GroupService.createGroup(parsed.data, userId);
      res.status(201).json({
        id: group.id,
        name: group.name,
        description: group.description,
        memberCount: group.members.length,
      });
      return void 0;
    } catch (err: any) {
      if (err.code === 'P2002') {
        next(new ApiError(409, 'Group name already exists', 'Conflict'));
        return;
      }
      throw err;
    }
  }),

  getGroups: asyncHandler(async function getGroups(req: Request, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const { groups, total } = await GroupService.getGroups(limit, offset);
    res.json({
      total,
      groups: groups.map((g: any) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        memberCount: g.members.length,
      })),
    });
    return void 0;
  }),

  getGroupById: asyncHandler(async function getGroupById(req: Request, res: Response): Promise<void> {
    const parsed = groupIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.errors[0].message, 'Bad Request');
    }
    const group = await GroupService.getGroupById(parsed.data.id);
    if (!group) {
      throw new ApiError(404, 'Group not found', 'Not Found');
    }
    res.json({
      id: group.id,
      name: group.name,
      description: group.description,
      memberCount: group.members.length,
    });
    return void 0;
  }),

  joinGroup: asyncHandler(async function joinGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = groupIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.errors[0].message, 'Bad Request');
    }
    const userId = req.user.id;
    try {
      const group = await GroupService.joinGroup(parsed.data.id, userId);
      res.json({
        message: 'Joined group successfully',
        groupId: group.id,
        memberCount: group.members.length,
      });
      return void 0;
    } catch (err: any) {
      if (err.code === 'P2025') {
        next(new ApiError(404, 'Group not found', 'Not Found'));
        return;
      }
      throw err;
    }
  }),

  leaveGroup: asyncHandler(async function leaveGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = groupIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.errors[0].message, 'Bad Request');
    }
    const userId = req.user.id;
    try {
      const group = await GroupService.leaveGroup(parsed.data.id, userId);
      res.json({
        message: 'Left group successfully',
        groupId: group.id,
        memberCount: group.members.length,
      });
      return void 0;
    } catch (err: any) {
      if (err.code === 'P2025') {
        next(new ApiError(404, 'Group not found', 'Not Found'));
        return;
      }
      throw err;
    }
  }),
};