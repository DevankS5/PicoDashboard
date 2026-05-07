import React from 'react';
import { Task, TaskStatus } from '../../types';
import { TaskRow } from './TaskRow';
import { TaskRowSkeleton } from '../ui/Skeleton';

interface TaskTableProps {
  tasks: Task[] | undefined;
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const headers = ['Name', 'Status', 'Assigned To', 'Deadline', ''];

export function TaskTable({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-[#1f1f1f]">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#555555]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <>
              <TaskRowSkeleton />
              <TaskRowSkeleton />
              <TaskRowSkeleton />
            </>
          ) : !tasks || tasks.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center text-sm italic text-[#888888]">
                No tasks yet. Create one above.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
