import React from 'react';
import { Modal } from '../ui/Modal';
import { StatusDot } from '../ui/StatusDot';
import { Agent } from '../../types';
import { useRelativeTime } from '../../hooks/useRelativeTime';

interface Props {
  agent: Agent | null;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-[#555555]">
        {label}
      </span>
      <span className="text-[13px] text-white break-all">{value}</span>
    </div>
  );
}

export function AgentDetailModal({ agent, onClose }: Props) {
  const lastChecked = useRelativeTime(agent?.last_checked_at ?? null);

  return (
    <Modal isOpen={!!agent} onClose={onClose} title="Agent Details">
      {agent && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <StatusDot isOnline={agent.is_online} />
            <span className="text-lg font-bold tracking-widest uppercase text-white">
              {agent.name}
            </span>
            <span
              className={`ml-auto text-[11px] font-semibold tracking-widest uppercase ${
                agent.is_online ? 'text-[#00ff87]' : 'text-[#ff3b3b]'
              }`}
            >
              {agent.is_online ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className="border-t border-white/[0.06]" />

          <div className="space-y-4">
            <Row label="Agent ID" value={agent.agent_id} />
            <Row
              label="Description"
              value={
                <span className={agent.description ? 'text-white' : 'text-[#444444] italic'}>
                  {agent.description || 'No description provided.'}
                </span>
              }
            />
            <Row label="Health Endpoint" value={agent.health_endpoint} />
<Row label="Last Health Check" value={agent.last_checked_at ? lastChecked : '—'} />
            <Row
              label="Registered"
              value={new Date(agent.created_at).toLocaleString()}
            />
            <Row label="MongoDB ID" value={<span className="font-mono text-[#888888] text-[11px]">{agent.id}</span>} />
          </div>
        </div>
      )}
    </Modal>
  );
}
