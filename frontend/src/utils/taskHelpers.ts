import { TaskStatus } from '../types';

export const statusConfig: Record<
  TaskStatus,
  { label: string; color: string; dotClass: string }
> = {
  NOT_STARTED: {
    label: 'Not Started',
    color: 'text-[#555555]',
    dotClass: 'border border-[#555555] bg-transparent',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-white',
    dotClass: 'bg-white',
  },
  REQUIRES_APPROVAL: {
    label: 'Needs Approval',
    color: 'text-[#ff3b3b]',
    dotClass: 'bg-[#ff3b3b]',
  },
  DONE: {
    label: 'Done',
    color: 'text-[#00ff87]',
    dotClass: 'bg-[#00ff87]',
  },
};
