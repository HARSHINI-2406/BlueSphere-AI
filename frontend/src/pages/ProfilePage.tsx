import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { apiClient } from '../api/client';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Mail, Building, Briefcase, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useStore();
  
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [role, setRole] = useState(user?.role || '');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Extract initials for the avatar logo
  const getInitials = () => {
    if (!user?.full_name) return "US";
    return user.full_name
      .split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Verify passwords if user input is present
    if (password && password !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        full_name: fullName,
        organization: organization,
        role: role
      };

      if (password) {
        payload.password = password;
      }

      const response = await apiClient.put('/auth/update', payload);
      const updatedUser = response.data;
      
      // Update state
      updateUser(updatedUser);
      setSuccess("Profile settings successfully updated");
      
      // Reset password fields
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Profile update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center">
          <User className="h-7 w-7 mr-3 text-cyan-400" />
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
          Review your credentials, organizational affiliations, and security tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side avatar and stats summary panel */}
        <Card className="bg-slate-900/30 border-slate-800/40 p-6 flex flex-col items-center text-center space-y-4 h-fit">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-50 flex items-center justify-center text-2xl font-black shadow-lg shadow-cyan-500/10">
            {getInitials()}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-lg">{user?.full_name || "Marine Analyst"}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>

          <div className="w-full border-t border-slate-800/80 pt-4 text-xs text-slate-400 space-y-2 text-left">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="truncate">Org: <strong className="text-slate-200">{user?.organization || "Independent"}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="truncate">Role: <strong className="text-slate-200">{user?.role || "Consultant"}</strong></span>
            </div>
          </div>
        </Card>

        {/* Right side editable configuration fields */}
        <Card className="bg-slate-900/30 border-slate-800/40 md:col-span-2 p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-300">Profile Settings</h3>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4 text-xs sm:text-sm">
            {/* Row 1: Full name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5 opacity-60">
                <label className="text-xs text-slate-400 font-semibold">Email Address (Read-only)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-slate-950/20 border border-slate-900 rounded-xl py-2 pl-10 pr-4 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Org & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Organization Name</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Professional Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Security updates password field */}
            <div className="pt-4 border-t border-slate-800/60 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Lock className="h-3.5 w-3.5 mr-1.5 text-cyan-500" />
                Change Password (optional)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave empty to keep current"
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 px-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Leave empty to keep current"
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-2 px-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2.5">
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </div>
  );
};
