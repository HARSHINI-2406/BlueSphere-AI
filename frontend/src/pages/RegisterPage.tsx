import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { apiClient } from '../api/client';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Waves, User, Mail, Lock, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const loginAction = useStore((state) => state.login);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form verification
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        full_name: fullName,
        organization: organization,
        role: role
      });

      const { user, access_token } = response.data;
      
      // Zustand sign-in
      loginAction(user, access_token);
      
      // Forward to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || "Account registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none"></div>

      <Card className="w-full max-w-md bg-slate-900/40 border-slate-800/60 p-8 space-y-5 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
            <Waves className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Create Account</h2>
          <p className="text-xs text-slate-400 font-light">Register to start monitoring marine data grids</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Org & Role (Optional inputs) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-semibold">Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Global Ocean Inst"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 px-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-semibold">Professional Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Oceanographer"
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 px-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 pl-9 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-semibold">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 pl-9 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Register button */}
          <Button type="submit" disabled={loading} className="w-full py-2.5 mt-2">
            {loading ? "Registering Profile..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-800/40">
          Already registered?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};
