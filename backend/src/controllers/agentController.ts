import { Request, Response, NextFunction } from 'express';
import { agentService } from '../services/agentService';
import { triggerHealthCheck } from '../services/healthService';

export const agentController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const agents = await agentService.getAll();
      res.json({ success: true, data: agents });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const agent = await agentService.getById(req.params.id);
      res.json({ success: true, data: agent });
    } catch (err) {
      next(err);
    }
  },

  async triggerHealthCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await triggerHealthCheck();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
