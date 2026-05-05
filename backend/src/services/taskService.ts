import { TaskStatus } from '@prisma/client';
import { prisma } from '../prisma';

const taskInclude = {
  assignedBy: { select: { id: true, name: true } },
  assignedTo: { select: { id: true, name: true } },
  board: { select: { id: true, name: true } },
};

export const taskService = {
  async getAll(filters: {
    boardId?: string;
    status?: TaskStatus;
    assignedToId?: string;
  }) {
    return prisma.task.findMany({
      where: {
        ...(filters.boardId ? { boardId: filters.boardId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.assignedToId
          ? { assignedToId: filters.assignedToId }
          : {}),
      },
      include: taskInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.task.findUniqueOrThrow({
      where: { id },
      include: taskInclude,
    });
  },

  async create(data: {
    boardId: string;
    title: string;
    description?: string;
    dueDate?: Date;
    assignedById?: string;
    assignedToId?: string;
    status?: TaskStatus;
  }) {
    return prisma.task.create({
      data,
      include: taskInclude,
    });
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      dueDate?: Date | null;
      assignedById?: string | null;
      assignedToId?: string | null;
      status?: TaskStatus;
      boardId?: string;
    }
  ) {
    return prisma.task.update({
      where: { id },
      data,
      include: taskInclude,
    });
  },

  async delete(id: string) {
    await prisma.task.delete({ where: { id } });
  },

  async requireApproval(taskId: string, reason?: string) {
    return prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'REQUIRES_APPROVAL',
        approvalNote: reason ?? null,
      },
      include: taskInclude,
    });
  },

  async resolve(taskId: string, action: 'approve' | 'reject') {
    const status: TaskStatus = action === 'approve' ? 'IN_PROGRESS' : 'NOT_STARTED';
    return prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: taskInclude,
    });
  },

  async getPendingApprovals() {
    return prisma.task.findMany({
      where: { status: 'REQUIRES_APPROVAL' },
      include: taskInclude,
      orderBy: { updatedAt: 'desc' },
    });
  },
};
