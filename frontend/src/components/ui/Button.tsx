import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Button({
  variant = 'solid',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  const variants = {
    solid:
      'bg-white text-black hover:bg-gray-100 active:bg-gray-200',
    ghost:
      'bg-transparent text-white border border-[#1f1f1f] hover:border-[#333333] hover:bg-white/5',
    danger:
      'bg-transparent text-[#ff3b3b] border border-[#ff3b3b]/30 hover:border-[#ff3b3b] hover:bg-[#ff3b3b]/10',
    success:
      'bg-transparent text-[#00ff87] border border-[#00ff87]/30 hover:border-[#00ff87] hover:bg-[#00ff87]/10 hover:shadow-glow-green',
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
