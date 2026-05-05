import { prisma } from '../prisma';

export const agentService = {
  async getAll() {
    return prisma.agent.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async getById(id: string) {
    return prisma.agent.findUniqueOrThrow({ where: { id } });
  },
};
