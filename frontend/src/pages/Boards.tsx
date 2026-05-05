import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBoards } from '../hooks/useBoards';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useAgents } from '../hooks/useAgents';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskModal } from '../components/tasks/TaskModal';
import { Button } from '../components/ui/Button';
import { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from '../types';

export function Boards() {
  const { data: boards, isLoading: boardsLoading } = useBoards();
  const { data: agents = [] } = useAgents();

  const defaultBoard = boards?.[0];
  const boardId = defaultBoard?.id ?? '';

  const { data: tasks, isLoading: tasksLoading } = useTasks(boardId);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  function openCreate() {
    setEditingTask(undefined);
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTask(undefined);
  }

  function handleSubmit(data: CreateTaskPayload | UpdateTaskPayload) {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, data: data as UpdateTaskPayload },
        { onSuccess: closeModal }
      );
    } else {
      createTask.mutate(data as CreateTaskPayload, { onSuccess: closeModal });
    }
  }

  function handleDelete(id: string) {
    deleteTask.mutate(id);
  }

  function handleStatusChange(id: string, status: TaskStatus) {
    updateTask.mutate({ id, data: { status } });
  }

  const inProgress = tasks?.filter((t) => t.status === 'IN_PROGRESS').length ?? 0;
  const needsApproval = tasks?.filter((t) => t.status === 'REQUIRES_APPROVAL').length ?? 0;
  const totalTasks = tasks?.length ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight mb-2">
            {boardsLoading ? '—' : (defaultBoard?.name ?? 'Mission Board')}
          </h1>
          <p className="text-[13px] text-[#888888]">
            {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            {inProgress > 0 && ` · ${inProgress} in progress`}
            {needsApproval > 0 && (
              <span className="text-[#ff3b3b]"> · {needsApproval} pending approval</span>
            )}
          </p>
        </div>

        <Button onClick={openCreate} disabled={!boardId}>
          <Plus size={14} />
          New Task
        </Button>
      </div>

      {/* Task Table */}
      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl overflow-hidden">
        <TaskTable
          tasks={tasks}
          isLoading={tasksLoading}
          onEdit={openEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Modal */}
      {boardId && (
        <TaskModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          agents={agents}
          boardId={boardId}
          task={editingTask}
          isLoading={createTask.isPending || updateTask.isPending}
        />
      )}
    </div>
  );
}
