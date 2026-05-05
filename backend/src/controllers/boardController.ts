import { Request, Response, NextFunction } from 'express';
import { boardService } from '../services/boardService';

export const boardController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const boards = await boardService.getAll();
      res.json({ success: true, data: boards });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const board = await boardService.create(req.body.name);
      res.status(201).json({ success: true, data: board });
    } catch (err) {
      next(err);
    }
  },
};
