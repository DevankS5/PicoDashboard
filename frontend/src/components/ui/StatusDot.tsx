import React from 'react';

interface StatusDotProps {
  isOnline: boolean;
}

export function StatusDot({ isOnline }: StatusDotProps) {
  return (
    <span
      className={`
        w-2.5 h-2.5 rounded-full inline-block flex-shrink-0
        ${
          isOnline
            ? 'bg-[#00ff87] shadow-glow-green animate-pulse'
            : 'bg-[#ff3b3b] shadow-glow-red'
        }
      `}
    />
  );
}
