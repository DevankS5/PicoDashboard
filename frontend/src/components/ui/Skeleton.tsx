import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#1f1f1f] rounded ${className}`}
    />
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-2.5 h-2.5 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-4/5 mb-2" />
      <Skeleton className="h-3 w-3/5 mb-6" />
      <div className="border-t border-[#1f1f1f] pt-3">
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function TaskRowSkeleton() {
  return (
    <tr className="border-b border-[#1f1f1f]">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-3 w-full" />
        </td>
      ))}
    </tr>
  );
}
