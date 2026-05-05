export type TaskStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'REQUIRES_APPROVAL'
  | 'DONE';

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  healthEndpoint: string;
  isOnline: boolean;
  lastCheckedAt: string | null;
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  createdAt: string;
  taskCount: number;
}

export interface Task {
  id: string;
  boardId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  assignedBy: { id: string; name: string } | null;
  assignedTo: { id: string; name: string } | null;
  status: TaskStatus;
  approvalNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  boardId: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignedById?: string;
  assignedToId?: string;
  status?: TaskStatus;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  assignedById?: string | null;
  assignedToId?: string | null;
  status?: TaskStatus;
}
