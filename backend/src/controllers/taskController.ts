import { Request, Response, NextFunction } from 'express';
import { TaskStatus } from '@prisma/client';
import { taskService } from '../services/taskService';

export const taskController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { boardId, status, assignedToId } = req.query;
      const tasks = await taskService.getAll({
        boardId: boardId as string | undefined,
        status: status as TaskStatus | undefined,
        assignedToId: assignedToId as string | undefined,
      });
      res.json({ success: true, data: tasks });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.getById(req.params.id);
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.create(req.body);
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.update(req.params.id, req.body);
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await taskService.delete(req.params.id);
      res.json({ success: true, data: { deleted: true, id: req.params.id } });
    } catch (err) {
      next(err);
    }
  },
};
