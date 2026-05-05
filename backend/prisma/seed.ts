import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seed...');

  const agents = [
    {
      name: 'Nexus',
      description:
        'Primary orchestration agent. Responsible for delegating tasks across the fleet and maintaining overall workflow state.',
      healthEndpoint:
        process.env.AGENT_NEXUS_HEALTH_URL || 'http://localhost:4001/health',
    },
    {
      name: 'Cipher',
      description:
        'Data processing and transformation agent. Handles all ETL operations and structured output generation.',
      healthEndpoint:
        process.env.AGENT_CIPHER_HEALTH_URL || 'http://localhost:4002/health',
    },
    {
      name: 'Relay',
      description:
        'Communication and integration agent. Manages all outbound API calls, webhooks, and third-party service interactions.',
      healthEndpoint:
        process.env.AGENT_RELAY_HEALTH_URL || 'http://localhost:4003/health',
    },
  ];

  for (const agent of agents) {
    const result = await prisma.agent.upsert({
      where: { name: agent.name },
      update: {
        description: agent.description,
        healthEndpoint: agent.healthEndpoint,
      },
      create: agent,
    });
    console.log(`[Seed] Agent upserted: ${result.name} (${result.id})`);
  }

  const defaultBoard = await prisma.board.upsert({
    where: { name: 'Mission Board' },
    update: {},
    create: { name: 'Mission Board' },
  });
  console.log(
    `[Seed] Board upserted: ${defaultBoard.name} (${defaultBoard.id})`
  );

  console.log('[Seed] Database seed complete.');
}

main()
  .catch((e) => {
    console.error('[Seed] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
