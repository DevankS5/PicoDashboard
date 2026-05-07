import React from 'react';
import { Agent } from '../../types';
import { StatusDot } from '../ui/StatusDot';
import { formatRelative } from '../../utils/formatDate';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 shadow-glow-sm transition-all duration-200 hover:border-[#333333] hover:shadow-glow-md flex flex-col h-full">
      <div className="flex items-center gap-2.5 mb-3">
        <StatusDot isOnline={agent.is_online} />
        <span className="text-base font-bold tracking-widest uppercase text-white">
          {agent.name}
        </span>
      </div>

      <p className="text-[13px] italic text-[#888888] leading-relaxed line-clamp-3 flex-1 mb-4">
        {agent.description || 'No description available.'}
      </p>

      <div className="border-t border-white/[0.06] pt-3 flex items-center gap-2">
        <span
          className={`text-[11px] font-semibold tracking-widest uppercase ${
            agent.is_online ? 'text-[#00ff87]' : 'text-[#ff3b3b]'
          }`}
        >
          {agent.is_online ? 'Online' : 'Offline'}
        </span>
        <span className="text-[#555555] text-[11px]">·</span>
        <span className="text-[11px] text-[#555555]">
          Last checked {formatRelative(agent.last_checked_at)}
        </span>
      </div>
    </div>
  );
}
