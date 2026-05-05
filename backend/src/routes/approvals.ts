import { Router } from 'express';
import { z } from 'zod';
import { approvalController } from '../controllers/approvalController';
import { validateRequest } from '../middleware/validateRequest';
import { agentAuth } from '../middleware/agentAuth';

const router = Router();

const requireApprovalSchema = z.object({
  taskId: z.string().uuid('taskId must be a valid UUID'),
  reason: z.string().optional(),
});

const resolveSchema = z.object({
  action: z.enum(['approve', 'reject']),
  note: z.string().optional(),
});

// Agent-facing: requires API key
router.post(
  '/require_approval',
  agentAuth,
  validateRequest(requireApprovalSchema),
  approvalController.requireApproval
);
// Operator-facing: no API key required
router.get('/', approvalController.getApprovals);
router.post(
  '/:taskId/resolve',
  validateRequest(resolveSchema),
  approvalController.resolve
);

export default router;
