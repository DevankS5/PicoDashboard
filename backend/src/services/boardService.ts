import { prisma } from '../prisma';

export const boardService = {
  async getAll() {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { tasks: true } } },
    });

    return boards.map((b) => ({
      id: b.id,
      name: b.name,
      createdAt: b.createdAt,
      taskCount: b._count.tasks,
    }));
  },

  async create(name: string) {
    return prisma.board.create({ data: { name } });
  },
};
