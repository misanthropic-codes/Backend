import express from 'express';
import { GroupsController } from '../controllers/groups.controller';
import { authenticateJWT } from '../middleware/authenticateJWT';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const joinLeaveLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { status: 429, error: 'Too Many Requests', message: 'Rate limit exceeded' },
});


router.post('/', authenticateJWT, GroupsController.createGroup);
router.get('/', GroupsController.getGroups);
router.get('/:id', GroupsController.getGroupById);
router.post('/:id/join', authenticateJWT, joinLeaveLimiter, GroupsController.joinGroup);
router.post('/:id/leave', authenticateJWT, joinLeaveLimiter, GroupsController.leaveGroup);

export default router;
