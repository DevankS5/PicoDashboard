import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useCreateAgent } from '../../hooks/useAgents';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  agent_id: string;
  description: string;
  health_endpoint: string;
}

const EMPTY: FormState = { name: '', agent_id: '', description: '', health_endpoint: '' };

export function AddAgentModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { mutate: createAgent, isPending, error } = useCreateAgent();

  function handleClose() {
    setForm(EMPTY);
    setApiKey(null);
    setCopied(false);
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createAgent(
      {
        name: form.name.trim(),
        agent_id: form.agent_id.trim(),
        description: form.description.trim() || undefined,
        health_endpoint: form.health_endpoint.trim(),
      },
      {
        onSuccess: (data) => {
          setApiKey(data.api_key ?? null);
        },
      },
    );
  }

  function copyKey() {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Agent">
      {apiKey ? (
        /* ── Step 2: show API key ── */
        <div className="space-y-5">
          <p className="text-[13px] text-[#888888] leading-relaxed">
            Agent registered. Copy the API key below — it is shown{' '}
            <span className="text-white font-semibold">only once</span> and never stored in plaintext.
          </p>

          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3">
            <code className="flex-1 text-[12px] text-[#00ff87] font-mono break-all select-all">
              {apiKey}
            </code>
            <button
              onClick={copyKey}
              className="shrink-0 text-[#555555] hover:text-white transition-colors"
              title="Copy"
            >
              {copied ? <Check size={15} className="text-[#00ff87]" /> : <Copy size={15} />}
            </button>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2.5 text-[13px] font-semibold bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        /* ── Step 1: form ── */
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Agent Name"
            required
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="Nexus"
          />
          <Field
            label="Agent ID"
            required
            value={form.agent_id}
            onChange={(v) => setForm((f) => ({ ...f, agent_id: v }))}
            placeholder="nexus-001"
          />
          <Field
            label="Description"
            value={form.description}
            onChange={(v) => setForm((f) => ({ ...f, description: v }))}
            placeholder="Optional — what does this agent do?"
          />
          <Field
            label="Health Endpoint"
            required
            value={form.health_endpoint}
            onChange={(v) => setForm((f) => ({ ...f, health_endpoint: v }))}
            placeholder="http://185.197.31.37:18790/health"
          />

          {error && (
            <p className="text-[12px] text-[#ff3b3b]">
              {(error as any)?.response?.data?.error ?? 'Something went wrong.'}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !form.name.trim() || !form.agent_id.trim() || !form.health_endpoint.trim()}
            className="w-full py-2.5 text-[13px] font-semibold bg-white text-black rounded-lg hover:bg-[#e0e0e0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? 'Registering…' : 'Register Agent'}
          </button>
        </form>
      )}
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold tracking-widest uppercase text-[#888888]">
        {label}
        {required && <span className="text-[#ff3b3b] ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder-[#444444] focus:outline-none focus:border-[#333333] transition-colors"
      />
    </div>
  );
}
