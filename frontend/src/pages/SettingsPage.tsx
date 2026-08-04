import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  RefreshCw, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, logout } = useStore();
  
  const [notifications, setNotifications] = useState(true);
  const [anomalyAlerts, setAnomalyAlerts] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('60');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center">
          <Settings className="h-7 w-7 mr-3 text-cyan-400" />
          Settings Console
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
          Adjust visual display properties, alert distributions, and API query durations.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm">
        
        {/* Visual Settings Panel */}
        <Card className="bg-slate-900/30 border-slate-800/40 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center">
            {theme === 'dark' ? <Moon className="h-4 w-4 mr-2 text-cyan-400" /> : <Sun className="h-4 w-4 mr-2 text-amber-400" />}
            Visual Interface
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-300">Dark Mode Theme</p>
              <p className="text-[11px] text-slate-500 font-light mt-0.5">Toggle interface styling elements between dark indigos and light templates.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl font-bold text-xs text-slate-300 hover:border-slate-700 transition-colors"
            >
              {theme === 'dark' ? "Active (Dark)" : "Toggle Dark"}
            </button>
          </div>
        </Card>

        {/* Telemetry Settings Panel */}
        <Card className="bg-slate-900/30 border-slate-800/40 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center">
            <RefreshCw className="h-4 w-4 mr-2 text-cyan-400" />
            Telemetry Logs Settings
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-300">Data Refresh Interval</p>
              <p className="text-[11px] text-slate-500 font-light mt-0.5">Define frequency for query requests pulling latest observations.</p>
            </div>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-300 focus:outline-none"
            >
              <option value="30">Every 30 Seconds</option>
              <option value="60">Every 1 Minute</option>
              <option value="300">Every 5 Minutes</option>
              <option value="manual">Manual Refresh Only</option>
            </select>
          </div>
        </Card>

        {/* Alert notification settings */}
        <Card className="bg-slate-900/30 border-slate-800/40 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center">
            <Bell className="h-4 w-4 mr-2 text-cyan-400" />
            Distributions & Warnings
          </h3>

          <div className="space-y-4">
            {/* System notifications */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-300">System Advisories</p>
                <p className="text-[11px] text-slate-500 font-light">Allow push notification banners for new biological recommendations.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
              />
            </div>

            {/* Anomaly triggers */}
            <div className="flex items-start justify-between pt-3 border-t border-slate-800/40">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-300">Extreme Heatwave Warnings</p>
                <p className="text-[11px] text-slate-500 font-light">Instantly flag anomaly observations exceeding safety metrics.</p>
              </div>
              <input
                type="checkbox"
                checked={anomalyAlerts}
                onChange={(e) => setAnomalyAlerts(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Logout triggers */}
        <Card className="bg-rose-950/10 border-rose-900/20 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-bold text-rose-400 flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Terminate Credentials Session
            </h4>
            <p className="text-[11px] text-slate-500 font-light mt-0.5">Log out from your current device profile. Active maps and layers cache will clear.</p>
          </div>
          <Button variant="danger" size="sm" onClick={logout} className="flex items-center space-x-1.5 shrink-0">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </Card>

      </div>
    </div>
  );
};
