import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, ...props }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-glass shadow-slate-950/30 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-sky-500/40 hover:bg-slate-900/60 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
