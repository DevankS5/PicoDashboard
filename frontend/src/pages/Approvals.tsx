import React from 'react';
import { useApprovals, useResolveApproval } from '../hooks/useApprovals';
import { ApprovalList } from '../components/approvals/ApprovalList';

export function Approvals() {
  const { data: tasks, isLoading } = useApprovals();
  const resolve = useResolveApproval();

  const pendingCount = tasks?.length ?? 0;

  function handleApprove(taskId: string) {
    resolve.mutate({ taskId, action: 'approve' });
  }

  function handleReject(taskId: string) {
    resolve.mutate({ taskId, action: 'reject' });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-white tracking-tight mb-2">
          Approvals
        </h1>
        <div className="w-full h-px bg-[#1f1f1f] mb-3" />
        <p className="text-[13px] text-[#888888] italic">
          {isLoading
            ? 'Loading...'
            : pendingCount === 0
            ? 'No pending approvals.'
            : `${pendingCount} task${pendingCount !== 1 ? 's' : ''} require${pendingCount === 1 ? 's' : ''} your attention`}
        </p>
      </div>

      <ApprovalList
        tasks={tasks}
        isLoading={isLoading}
        onApprove={handleApprove}
        onReject={handleReject}
        isResolving={resolve.isPending}
      />
    </div>
  );
}
