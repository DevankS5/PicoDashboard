import React, { useState } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { useAgents, useRefreshAgents } from '../hooks/useAgents';
import { AgentGrid } from '../components/agents/AgentGrid';
import { AddAgentModal } from '../components/agents/AddAgentModal';
import { useRelativeTime } from '../hooks/useRelativeTime';

function LastCheckedLabel({ date }: { date: string | null }) {
  const label = useRelativeTime(date);
  return <>{date ? label : '—'}</>;
}

export function Dashboard() {
  const { data: agents, isLoading } = useAgents();
  const refresh = useRefreshAgents();
  const [showAdd, setShowAdd] = useState(false);

  const onlineCount = agents?.filter((a) => a.is_online).length ?? 0;
  const totalCount = agents?.length ?? 0;

  const lastChecked = agents
    ?.map((a) => a.last_checked_at)
    .filter(Boolean)
    .sort()
    .at(-1) ?? null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-[42px] text-white mb-2 leading-none"
            style={{ fontFamily: '"Playfair Display", "Didot", serif', fontStyle: 'italic', fontWeight: 400, letterSpacing: '-0.01em' }}
          >
            Mission Control
          </h1>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="text-[#888888]">
              Active Agents{' '}
              <span className="text-white font-semibold">
                {isLoading ? '—' : `${onlineCount} / ${totalCount}`}
              </span>
            </span>
            <span className="text-[#333333]">·</span>
            <span className="text-[#888888] italic">
              Last checked: <LastCheckedLabel date={lastChecked} />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-3 py-2 text-xs text-[#888888] hover:text-white border border-[#1f1f1f] hover:border-[#333333] rounded-lg transition-all duration-150"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-black bg-white hover:bg-[#e0e0e0] rounded-lg transition-all duration-150"
          >
            <Plus size={13} />
            Add Agent
          </button>
        </div>
      </div>

      <AgentGrid agents={agents} isLoading={isLoading} />

      <AddAgentModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
