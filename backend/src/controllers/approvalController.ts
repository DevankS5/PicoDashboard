import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/taskService';

export const approvalController = {
  async requireApproval(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId, reason } = req.body;
      await taskService.requireApproval(taskId, reason);
      res.json({
        success: true,
        data: {
          taskId,
          status: 'REQUIRES_APPROVAL',
          message: 'Task flagged for human approval. An operator will review shortly.',
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getApprovals(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskService.getPendingApprovals();
      res.json({ success: true, data: tasks });
    } catch (err) {
      next(err);
    }
  },

  async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const { action } = req.body;
      const task = await taskService.resolve(taskId, action);
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },
};
