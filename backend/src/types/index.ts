export type TaskStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'REQUIRES_APPROVAL'
  | 'DONE';

export interface AgentRecord {
  id: string;
  name: string;
  description: string | null;
  healthEndpoint: string;
  isOnline: boolean;
  lastCheckedAt: Date | null;
  createdAt: Date;
}

export interface BoardRecord {
  id: string;
  name: string;
  createdAt: Date;
}

export interface TaskRecord {
  id: string;
  boardId: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  assignedById: string | null;
  assignedToId: string | null;
  status: TaskStatus;
  approvalNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}
