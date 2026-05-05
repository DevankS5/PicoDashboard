import { Router } from 'express';
import { z } from 'zod';
import { boardController } from '../controllers/boardController';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

const createBoardSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
});

router.get('/', boardController.getAll);
router.post('/', validateRequest(createBoardSchema), boardController.create);

export default router;
