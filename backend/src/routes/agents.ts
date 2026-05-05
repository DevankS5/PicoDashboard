import { Router } from 'express';
import { agentController } from '../controllers/agentController';

const router = Router();

router.get('/', agentController.getAll);
router.get('/:id', agentController.getById);
router.post('/health-check', agentController.triggerHealthCheck);

export default router;
