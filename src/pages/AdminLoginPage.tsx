import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  AlertCircle, 
  Loader2, 
  Building2, 
  KeyRound, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onReturnHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ 
  onSuccess, 
  onReturnHome 
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your official admin email and password.');
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
      onSuccess();
    } catch (err: any) {
      console.error('Admin Login Error:', err);
      if (
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/invalid-credential'
      ) {
        setError('Invalid administrative credentials. Please check your official email and password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Access temporarily disabled due to too many failed attempts. Please try again later.');
      } else {
        setError('Authentication failed. Please verify your connection or consult system administrator.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      
      {/* Top Brand Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-xl bg-[#008C45] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          Admin Console Sign-In
        </h1>
        <p className="mt-1 text-xs text-stone-600 font-medium">
          Intercountry Centre for Oral Health (ICOH) for Africa
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8">
        
        {/* Institutional notice badge */}
        <div className="mb-6 p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 leading-normal flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            Restricted to authorized ICOH Payroll Desk Officers and Super Administrators via Firebase Authentication.
          </span>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                id="admin-email-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@icoh.gov.ng"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                id="admin-password-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="admin-login-submit-btn"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#008C45] hover:bg-[#007439] text-white text-xs sm:text-sm font-bold shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate to Console</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* First time setup guidance toggle */}
        <div className="mt-6 pt-4 border-t border-stone-100 text-center">
          <button
            type="button"
            id="toggle-setup-guide-btn"
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            className="text-[11px] text-stone-500 hover:text-emerald-700 font-semibold inline-flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showSetupGuide ? 'Hide Administrator Setup Guide' : 'How to set up the first Super Administrator'}</span>
          </button>

          {showSetupGuide && (
            <div className="mt-3 p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-left text-[11px] text-stone-700 space-y-2">
              <p className="font-bold text-[#008C45] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Firebase Setup Instructions:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-stone-600">
                <li>Go to the <strong>Firebase Console &gt; Authentication &gt; Users</strong>.</li>
                <li>Click <strong>Add user</strong> with your official email (e.g., <code>admin@icoh.gov.ng</code>) and a strong password.</li>
                <li>When that account logs in here for the first time, our system registers their document under the <code>admins</code> collection with <code>SuperAdmin</code> privileges.</li>
                <li>Subsequent officers can be assigned as <code>PayrollOfficer</code> or <code>SuperAdmin</code> directly within the console or via custom claims.</li>
              </ol>
            </div>
          )}
        </div>

      </div>

      <div className="mt-4 text-center">
        <button
          onClick={onReturnHome}
          className="text-xs text-stone-500 hover:text-stone-800 font-medium"
        >
          &larr; Back to Public Portal
        </button>
      </div>

    </div>
  );
};
