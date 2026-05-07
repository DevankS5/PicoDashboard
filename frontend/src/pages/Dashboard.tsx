import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useAgents, useRefreshAgents } from '../hooks/useAgents';
import { AgentGrid } from '../components/agents/AgentGrid';
import { formatRelative } from '../utils/formatDate';

export function Dashboard() {
  const { data: agents, isLoading, dataUpdatedAt } = useAgents();
  const refresh = useRefreshAgents();

  const onlineCount = agents?.filter((a) => a.is_online).length ?? 0;
  const totalCount = agents?.length ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight mb-2">
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
              Last checked:{' '}
              {dataUpdatedAt ? formatRelative(new Date(dataUpdatedAt).toISOString()) : '—'}
            </span>
          </div>
        </div>

        <button
          onClick={refresh}
          className="flex items-center gap-2 px-3 py-2 text-xs text-[#888888] hover:text-white border border-[#1f1f1f] hover:border-[#333333] rounded-lg transition-all duration-150"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      <AgentGrid agents={agents} isLoading={isLoading} />
    </div>
  );
}
