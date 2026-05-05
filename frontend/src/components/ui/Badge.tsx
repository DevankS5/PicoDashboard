import React from 'react';
import { TaskStatus } from '../../types';
import { statusConfig } from '../../utils/taskHelpers';

interface BadgeProps {
  status: TaskStatus;
}

export function Badge({ status }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium tracking-wide ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}
