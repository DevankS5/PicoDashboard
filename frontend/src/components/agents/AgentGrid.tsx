import React from 'react';
import { Agent } from '../../types';
import { AgentCard } from './AgentCard';
import { AgentCardSkeleton } from '../ui/Skeleton';

interface AgentGridProps {
  agents: Agent[] | undefined;
  isLoading: boolean;
}

export function AgentGrid({ agents, isLoading }: AgentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <AgentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <p className="text-[#888888] italic text-sm text-center py-12">
        No agents registered.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
