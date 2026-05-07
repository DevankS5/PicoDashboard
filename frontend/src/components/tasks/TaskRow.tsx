import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function openMenu() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const menuWidth = 208; // w-52
      const menuHeight = 200;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < menuHeight ? rect.top - menuHeight - 4 : rect.bottom + 4;
      // align right edge of menu to right edge of button, clamp to viewport
      const left = Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8);
      setMenuPos({ top, left });
    }
    setMenuOpen((v) => !v);
  }

  const menu = menuOpen ? createPortal(
    <div
      ref={menuRef}
      style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 99999 }}
      className="w-52 bg-[#111111] border border-[#2a2a2a] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-visible"
    >
      <button
        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-white hover:bg-white/5 transition-colors"
        onClick={() => { onEdit(task); setMenuOpen(false); }}
      >
        <Edit2 size={12} /> Edit task
      </button>

      <div className="border-t border-[#1f1f1f] px-3 pt-2 pb-1">
        <p className="text-[10px] text-[#555555] uppercase tracking-widest mb-1.5">Change status</p>
        {statusOptions
          .filter((s) => s !== task.status)
          .map((s) => (
            <button
              key={s}
              className="w-full flex items-center gap-2 py-1.5 text-xs text-[#888888] hover:text-white transition-colors"
              onClick={() => { onStatusChange(task.id, s); setMenuOpen(false); }}
            >
              <RefreshCw size={10} />
              {s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
      </div>

      <div className="border-t border-[#1f1f1f]">
        <button
          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[#ff3b3b] hover:bg-[#ff3b3b]/10 transition-colors"
          onClick={() => { onDelete(task.id); setMenuOpen(false); }}
        >
          <Trash2 size={12} /> Delete task
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <tr className="border-b border-[#1f1f1f] hover:bg-white/[0.02] transition-colors h-[52px]">
      <td className="px-4 py-3 text-sm text-white font-medium max-w-xs truncate">
        {task.name}
      </td>
      <td className="px-4 py-3">
        <TaskStatusBadge status={task.status} />
      </td>
      <td className="px-4 py-3 text-sm text-[#888888]">
        {task.assigned_to?.name || '—'}
      </td>
      <td className="px-4 py-3 text-sm text-[#888888]">
        {formatDate(task.deadline)}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          ref={btnRef}
          onClick={openMenu}
          className="p-1 text-[#555555] hover:text-white transition-colors rounded"
        >
          <MoreHorizontal size={16} />
        </button>
        {menu}
      </td>
    </tr>
  );
}
