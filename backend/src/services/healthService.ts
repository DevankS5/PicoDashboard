import cron from 'node-cron';
import axios from 'axios';
import { prisma } from '../prisma';
import { Agent } from '@prisma/client';

const TIMEOUT_MS = parseInt(process.env.HEALTH_CHECK_TIMEOUT_MS || '5000');

// Runtime env overrides — checked first, falling back to DB value
const HEALTH_URL_OVERRIDES: Record<string, string | undefined> = {
  nexus: process.env.AGENT_NEXUS_HEALTH_URL,
  cipher: process.env.AGENT_CIPHER_HEALTH_URL,
  relay: process.env.AGENT_RELAY_HEALTH_URL,
};

function resolveHealthEndpoint(agent: Agent): string {
  const key = agent.name.toLowerCase();
  return HEALTH_URL_OVERRIDES[key] || agent.healthEndpoint;
}

async function checkAgentHealth(agent: Agent): Promise<boolean> {
  const url = resolveHealthEndpoint(agent);
  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    return response.status >= 200 && response.status < 300;
  } catch {
    return false;
  }
}

async function runHealthCycle(): Promise<void> {
  try {
    const agents = await prisma.agent.findMany();
    let online = 0;

    for (const agent of agents) {
      const resolvedEndpoint = resolveHealthEndpoint(agent);
      const isOnline = await checkAgentHealth(agent);
      if (isOnline) online++;
      await prisma.agent.update({
        where: { id: agent.id },
        data: {
          isOnline,
          lastCheckedAt: new Date(),
          // Keep DB in sync with env overrides so API responses show the real URL
          ...(resolvedEndpoint !== agent.healthEndpoint && {
            healthEndpoint: resolvedEndpoint,
          }),
        },
      });
    }

    console.log(
      `[Health] Cycle complete. ${agents.length} checked. ${online} online. ${agents.length - online} offline. ${new Date().toISOString()}`
    );
  } catch (err) {
    console.error('[Health] Cycle error:', err);
  }
}

export async function triggerHealthCheck(): Promise<{
  checked: number;
  online: number;
  offline: number;
}> {
  const agents = await prisma.agent.findMany();
  let online = 0;

  for (const agent of agents) {
    const resolvedEndpoint = resolveHealthEndpoint(agent);
    const isOnline = await checkAgentHealth(agent);
    if (isOnline) online++;
    await prisma.agent.update({
      where: { id: agent.id },
      data: {
        isOnline,
        lastCheckedAt: new Date(),
        ...(resolvedEndpoint !== agent.healthEndpoint && {
          healthEndpoint: resolvedEndpoint,
        }),
      },
    });
  }

  return { checked: agents.length, online, offline: agents.length - online };
}

export function startHealthScheduler(): void {
  runHealthCycle();
  cron.schedule('*/5 * * * *', runHealthCycle);
  console.log('[Health] Scheduler started. Interval: 5 minutes');
}
