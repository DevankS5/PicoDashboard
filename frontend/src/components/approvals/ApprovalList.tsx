import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Task } from '../../types';
import { ApprovalCard } from './ApprovalCard';
import { Skeleton } from '../ui/Skeleton';

interface ApprovalListProps {
  tasks: Task[] | undefined;
  isLoading: boolean;
  onApprove: (taskId: string) => void;
  onReject: (taskId: string) => void;
  isResolving?: boolean;
}

export function ApprovalList({
  tasks,
  isLoading,
  onApprove,
  onReject,
  isResolving,
}: ApprovalListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5">
            <Skeleton className="h-3 w-32 mb-4" />
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-4/5 mb-4" />
            <div className="flex justify-end gap-2">
              <Skeleton className="h-7 w-16 rounded-lg" />
              <Skeleton className="h-7 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle size={32} className="text-[#00ff87] mb-3" />
        <p className="text-[#888888] italic text-sm">All clear. No pending approvals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <ApprovalCard
          key={task.id}
          task={task}
          onApprove={onApprove}
          onReject={onReject}
          isLoading={isResolving}
        />
      ))}
    </div>
  );
}
