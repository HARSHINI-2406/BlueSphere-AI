import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves, LayoutDashboard, BarChart3, Fish, ShieldAlert, Cpu, User, Settings, LogOut } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { isAuthenticated, logout } = useStore();

  const authenticatedNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/ocean', label: 'Ocean', icon: BarChart3 },
    { to: '/fisheries', label: 'Fisheries', icon: Fish },
    { to: '/biodiversity', label: 'Biodiversity', icon: ShieldAlert },
    { to: '/insights', label: 'AI Insights', icon: Cpu },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/40 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors">
            <Waves className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 bg-clip-text text-transparent">
            BlueSphere AI
          </span>
        </Link>
        
        {/* Navigation links */}
        <nav className="flex space-x-1 items-center overflow-x-auto">
          {isAuthenticated ? (
            <>
              {authenticatedNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = path === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                      isActive 
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={logout}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all border border-transparent whitespace-nowrap ml-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  path === '/login' 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  path === '/register' 
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold hover:opacity-90' 
                    : 'text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
