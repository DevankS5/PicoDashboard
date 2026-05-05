import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5
        shadow-glow-sm transition-all duration-200
        hover:border-[#333333] hover:shadow-glow-md
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
