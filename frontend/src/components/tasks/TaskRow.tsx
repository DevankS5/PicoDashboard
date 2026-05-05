import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { TaskStatusBadge } from './TaskStatusBadge';
import { formatDate } from '../../utils/formatDate';

interface TaskRowProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const statusOptions: TaskStatus[] = [
  'NOT_STARTED',
  'IN_PROGRESS',
  'REQUIRES_APPROVAL',
  'DONE',
];

export function TaskRow({ task, onEdit, onDelete, onStatusChange }: TaskRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <tr className="border-b border-[#1f1f1f] hover:bg-white/[0.02] transition-colors h-[52px]">
      <td className="px-4 py-3 text-sm text-white font-medium max-w-xs truncate">
        {task.title}
      </td>
      <td className="px-4 py-3">
        <TaskStatusBadge status={task.status} />
      </td>
      <td className="px-4 py-3 text-sm text-[#888888]">
        {task.assignedTo?.name || '—'}
      </td>
      <td className="px-4 py-3 text-sm text-[#888888]">
        {formatDate(task.dueDate)}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="relative inline-block" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 text-[#555555] hover:text-white transition-colors rounded"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-7 z-10 w-44 bg-[#111111] border border-[#1f1f1f] rounded-lg shadow-glow-md overflow-hidden">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/5 transition-colors"
                onClick={() => { onEdit(task); setMenuOpen(false); }}
              >
                <Edit2 size={12} /> Edit task
              </button>

              <div className="border-t border-[#1f1f1f] px-3 py-1">
                <p className="text-[10px] text-[#555555] uppercase tracking-widest mb-1">Change status</p>
                {statusOptions
                  .filter((s) => s !== task.status)
                  .map((s) => (
                    <button
                      key={s}
                      className="w-full flex items-center gap-2 py-1 text-xs text-[#888888] hover:text-white transition-colors"
                      onClick={() => { onStatusChange(task.id, s); setMenuOpen(false); }}
                    >
                      <RefreshCw size={10} />
                      {s.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                    </button>
                  ))}
              </div>

              <div className="border-t border-[#1f1f1f]">
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#ff3b3b] hover:bg-[#ff3b3b]/10 transition-colors"
                  onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                >
                  <Trash2 size={12} /> Delete task
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
