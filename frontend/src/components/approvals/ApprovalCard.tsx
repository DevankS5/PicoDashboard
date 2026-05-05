import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Task } from '../../types';
import { Button } from '../ui/Button';
import { formatDateTime } from '../../utils/formatDate';

interface ApprovalCardProps {
  task: Task;
  onApprove: (taskId: string) => void;
  onReject: (taskId: string) => void;
  isLoading?: boolean;
}

export function ApprovalCard({
  task,
  onApprove,
  onReject,
  isLoading,
}: ApprovalCardProps) {
  return (
    <div className="bg-[#0a0a0a] border-l-[3px] border-l-[#ff3b3b] border border-[#1f1f1f] rounded-r-xl rounded-bl-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-[#ff3b3b] flex-shrink-0 mt-0.5" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#ff3b3b]">
            Requires Approval
          </span>
        </div>
        <span className="text-xs text-[#555555]">{formatDateTime(task.updatedAt)}</span>
      </div>

      <div className="border-t border-[#1f1f1f] pt-3 mb-3">
        <p className="text-sm font-semibold text-white mb-1">{task.title}</p>
        {task.assignedTo && (
          <p className="text-xs text-[#888888]">
            Agent:{' '}
            <span className="text-white font-medium">{task.assignedTo.name}</span>{' '}
            → requested intervention
          </p>
        )}
      </div>

      {task.approvalNote && (
        <div className="mb-4">
          <p className="text-xs text-[#555555] uppercase tracking-widest mb-1.5">Reason</p>
          <blockquote className="text-sm text-[#888888] italic border-l border-[#333333] pl-3 leading-relaxed">
            "{task.approvalNote}"
          </blockquote>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="danger"
          size="sm"
          onClick={() => onReject(task.id)}
          disabled={isLoading}
        >
          Reject
        </Button>
        <Button
          variant="success"
          size="sm"
          onClick={() => onApprove(task.id)}
          disabled={isLoading}
        >
          Approve →
        </Button>
      </div>
    </div>
  );
}
