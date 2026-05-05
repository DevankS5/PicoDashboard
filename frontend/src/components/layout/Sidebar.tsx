import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Columns, AlertTriangle, Radio } from 'lucide-react';
import { useApprovals } from '../../hooks/useApprovals';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/' },
  { id: 'boards', label: 'Boards', icon: Columns, path: '/boards' },
  { id: 'approvals', label: 'Approvals', icon: AlertTriangle, path: '/approvals', badge: true },
];

export function Sidebar() {
  const { data: approvals } = useApprovals();
  const pendingCount = approvals?.length ?? 0;

  return (
    <aside className="w-16 hover:w-[220px] group transition-all duration-300 ease-in-out flex-shrink-0 border-r border-[#1f1f1f] flex flex-col bg-black h-screen sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1f1f1f] min-h-[64px]">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center">
          <Radio size={14} className="text-black" />
        </div>
        <span className="text-sm font-bold tracking-widest uppercase text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
          Mission Control
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ id, label, icon: Icon, path, badge }) => (
          <NavLink
            key={id}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-2.5 rounded-lg transition-all duration-150 relative
               ${
                 isActive
                   ? 'text-white bg-white/[0.04] border-l-2 border-white pl-[calc(0.5rem-2px)]'
                   : 'text-[#888888] hover:text-white hover:bg-white/[0.06] border-l-2 border-transparent pl-[calc(0.5rem-2px)]'
               }`
            }
          >
            <div className="relative flex-shrink-0">
              <Icon size={18} />
              {badge && pendingCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#ff3b3b] rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </div>
            <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
