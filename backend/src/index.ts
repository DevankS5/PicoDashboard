import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { startHealthScheduler } from './services/healthService';
import agentRoutes from './routes/agents';
import taskRoutes from './routes/tasks';
import boardRoutes from './routes/boards';
import approvalRoutes from './routes/approvals';
import { errorHandler } from './middleware/errorHandler';
import { validateRequest } from './middleware/validateRequest';
import { agentAuth } from './middleware/agentAuth';
import { z } from 'zod';
import { approvalController } from './controllers/approvalController';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(morgan('dev'));

app.use('/agents', agentRoutes);
app.use('/tasks', taskRoutes);
app.use('/boards', boardRoutes);
app.use('/approvals', approvalRoutes);

// Top-level agent shortcut: POST /require_approval (agent-facing, requires API key)
const requireApprovalSchema = z.object({
  taskId: z.string().uuid('taskId must be a valid UUID'),
  reason: z.string().optional(),
});
app.post(
  '/require_approval',
  agentAuth,
  validateRequest(requireApprovalSchema),
  approvalController.requireApproval
);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  startHealthScheduler();
});
