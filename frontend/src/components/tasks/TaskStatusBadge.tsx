import React from 'react';
import { Badge } from '../ui/Badge';
import { TaskStatus } from '../../types';

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge status={status} />;
}
