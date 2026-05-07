export type TaskStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'REQUIRES_APPROVAL'
  | 'DONE';

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  health_endpoint: string;
  is_online: boolean;
  last_checked_at: string | null;
  created_at: string;
  bot_webhook_url: string | null;
}

export interface Board {
  id: string;
  name: string;
  created_at: string;
}

export interface Task {
  id: string;
  board_id: string;
  name: string;
  description: string | null;
  deadline: string | null;
  assigned_by: { id: string; name: string } | null;
  assigned_to: { id: string; name: string } | null;
  status: TaskStatus;
  approval_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskPayload {
  board_id: string;
  name: string;
  description?: string;
  deadline?: string;
  assigned_by?: string;
  assigned_to?: string;
  status?: TaskStatus;
}

export interface UpdateTaskPayload {
  name?: string;
  description?: string | null;
  deadline?: string | null;
  assigned_by?: string | null;
  assigned_to?: string | null;
  status?: TaskStatus;
}

export interface CreateAgentPayload {
  name: string;
  description?: string;
  health_endpoint: string;
  bot_webhook_url?: string;
}
