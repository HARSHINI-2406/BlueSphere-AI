import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { apiClient } from '../api/client';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Waves, Mail, Lock, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginAction = useStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user, access_token } = response.data;
      
      // Store state
      loginAction(user, access_token);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || "Authentication failed. Please verify credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none"></div>

      <Card className="w-full max-w-md bg-slate-900/40 border-slate-800/60 p-8 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
            <Waves className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Welcome Back</h2>
          <p className="text-xs text-slate-400 font-light">Sign in to access your marine intelligence portal</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Remember me & Forget link */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 focus:ring-offset-0"
              />
              <span>Remember me</span>
            </label>
            <span className="hover:text-cyan-400 cursor-default transition-colors">Forgot Password?</span>
          </div>

          {/* Login button */}
          <Button type="submit" disabled={loading} className="w-full py-3 mt-2">
            {loading ? "Authenticating Session..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-800/40">
          New to the portal?{" "}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
            Create Account
          </Link>
        </div>
      </Card>
    </div>
  );
};
