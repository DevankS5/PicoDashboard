import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Agent } from '../../types';
import { StatusDot } from '../ui/StatusDot';
import { useRelativeTime } from '../../hooks/useRelativeTime';
import { useDeleteAgent } from '../../hooks/useAgents';
import { AgentDetailModal } from './AgentDetailModal';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const { mutate: deleteAgent, isPending } = useDeleteAgent();
  const lastChecked = useRelativeTime(agent.last_checked_at);

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirming) {
      setConfirming(true);
      return;
    }
    deleteAgent(agent.id, { onSettled: () => setConfirming(false) });
  }

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 shadow-glow-sm transition-all duration-200 hover:border-[#333333] hover:shadow-glow-md flex flex-col h-full cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <StatusDot isOnline={agent.is_online} />
            <span className="text-base font-bold tracking-widest uppercase text-white">
              {agent.name}
            </span>
          </div>

          <button
            onClick={handleDelete}
            disabled={isPending}
            onBlur={() => setConfirming(false)}
            title={confirming ? 'Click again to confirm' : 'Remove agent'}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold transition-all duration-150 ${
              confirming
                ? 'bg-[#ff3b3b]/10 text-[#ff3b3b] border border-[#ff3b3b]/30'
                : 'text-[#444444] hover:text-[#ff3b3b] border border-transparent hover:border-[#ff3b3b]/20'
            }`}
          >
            <Trash2 size={12} />
            {confirming ? 'Confirm?' : ''}
          </button>
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
            Last checked {lastChecked}
          </span>
          <span className="text-[#555555] text-[11px] ml-auto font-mono">
            {agent.agent_id}
          </span>
        </div>
      </div>

      <AgentDetailModal agent={showDetail ? agent : null} onClose={() => setShowDetail(false)} />
    </>
  );
}
