import { Router } from 'express';
import { z } from 'zod';
import { taskController } from '../controllers/taskController';
import { validateRequest } from '../middleware/validateRequest';
import { agentAuth } from '../middleware/agentAuth';

const router = Router();

const createTaskSchema = z.object({
  boardId: z.string().uuid('boardId must be a valid UUID'),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  dueDate: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  assignedById: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),
  status: z
    .enum(['NOT_STARTED', 'IN_PROGRESS', 'REQUIRES_APPROVAL', 'DONE'])
    .optional(),
});

const updateTaskSchema = z.object({
  boardId: z.string().uuid().optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v ? new Date(v) : v === null ? null : undefined)),
  assignedById: z.string().uuid().nullable().optional(),
  assignedToId: z.string().uuid().nullable().optional(),
  status: z
    .enum(['NOT_STARTED', 'IN_PROGRESS', 'REQUIRES_APPROVAL', 'DONE'])
    .optional(),
});

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
// Agent-facing write endpoints require a valid API key
router.post('/', agentAuth, validateRequest(createTaskSchema), taskController.create);
router.put('/:id', agentAuth, validateRequest(updateTaskSchema), taskController.update);
router.delete('/:id', taskController.delete);

export default router;
