import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Agent, Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskPayload | UpdateTaskPayload) => void;
  agents: Agent[];
  boardId: string;
  task?: Task;
  isLoading?: boolean;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'NOT_STARTED', label: 'Not Started' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REQUIRES_APPROVAL', label: 'Requires Approval' },
  { value: 'DONE', label: 'Done' },
];

const inputClass =
  'w-full bg-black border border-[#1f1f1f] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-white focus:ring-1 focus:ring-white/10 transition-colors';

const labelClass = 'block text-xs font-semibold tracking-widest uppercase text-[#888888] mb-1.5';

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  agents,
  boardId,
  task,
  isLoading,
}: TaskModalProps) {
  const isEdit = !!task;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedById, setAssignedById] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TaskStatus>('NOT_STARTED');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setAssignedById(task.assignedBy?.id || '');
      setAssignedToId(task.assignedTo?.id || '');
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setAssignedById('');
      setAssignedToId('');
      setDueDate('');
      setStatus('NOT_STARTED');
    }
    setError('');
  }, [task, isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    const payload = {
      ...(isEdit ? {} : { boardId }),
      title: title.trim(),
      description: description.trim() || undefined,
      assignedById: assignedById || undefined,
      assignedToId: assignedToId || undefined,
      dueDate: dueDate || undefined,
      status,
    };
    onSubmit(payload);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'New Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Title *</label>
          <input
            className={inputClass}
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          {error && <p className="text-[#ff3b3b] text-xs mt-1">{error}</p>}
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            className={`${inputClass} resize-none`}
            placeholder="Optional description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Assigned By</label>
            <select
              className={inputClass}
              value={assignedById}
              onChange={(e) => setAssignedById(e.target.value)}
            >
              <option value="">Select Agent</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Assigned To</label>
            <select
              className={inputClass}
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
            >
              <option value="">Select Agent</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Due Date</label>
            <input
              type="date"
              className={inputClass}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#1f1f1f] mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="solid" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
