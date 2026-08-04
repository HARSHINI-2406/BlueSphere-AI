import React from 'react';
import { Waves } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/40 bg-slate-950/60 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-slate-500 text-xs sm:text-sm">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-cyan-500/10 rounded-md border border-cyan-500/20">
            <Waves className="h-4 w-4 text-cyan-400" />
          </div>
          <span className="font-semibold text-slate-400">BlueSphere AI</span>
        </div>
        <div>
          <span>BlueSphere AI © 2026</span>
        </div>
      </div>
    </footer>
  );
};
