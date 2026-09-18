import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Clock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updatePassword, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const AdminProfile: React.FC = () => {
  const { currentUser, adminProfile, role, refreshProfile } = useAuth();
  
  const [fullName, setFullName] = useState(adminProfile?.fullName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setSaving(true);

    try {
      if (currentUser && fullName.trim()) {
        await updateProfile(currentUser, { displayName: fullName.trim() });
        await updateDoc(doc(db, 'admins', currentUser.uid), {
          fullName: fullName.trim()
        });
      }

      if (newPassword) {
        if (newPassword.length < 6) {
          setError('Password must be at least 6 characters long.');
          setSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setError('Passwords do not match.');
          setSaving(false);
          return;
        }
        if (currentUser) {
          await updatePassword(currentUser, newPassword);
          setNewPassword('');
          setConfirmPassword('');
        }
      }

      await refreshProfile();
      setSuccess('Profile and security details updated successfully.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (val: any) => {
    if (!val) return '—';
    try {
      const date = val.toDate ? val.toDate() : new Date(val);
      return date.toLocaleString();
    } catch {
      return '—';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          Admin Profile &amp; Role Credentials
        </h1>
        <p className="text-xs text-stone-600">
          View your organizational role, permissions, and update your officer profile.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Badge Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#008C45] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">
              {adminProfile?.fullName || 'Payroll Desk Staff'}
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              {adminProfile?.email || currentUser?.email}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
            Institutional Role
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
            role === 'SuperAdmin' 
              ? 'bg-purple-100 text-purple-800 border-purple-300' 
              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
          }`}>
            {role === 'SuperAdmin' ? 'Super Administrator' : 'Payroll Desk Officer'}
          </span>
        </div>
      </div>

      {/* Role Permissions Summary */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-100 pb-2">
          Authorized Privileges for Your Account
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>View and search incoming employee requests</span>
          </div>
          <div className="flex items-center gap-2 text-stone-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Update status to Processing / Completed / Sent</span>
          </div>
          <div className="flex items-center gap-2 text-stone-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Attach internal processing and audit notes</span>
          </div>
          <div className="flex items-center gap-2 text-stone-700">
            {role === 'SuperAdmin' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-stone-400" />
            )}
            <span className={role === 'SuperAdmin' ? 'font-semibold text-purple-900' : 'text-stone-400'}>
              Audit Logs and System Administration ({role === 'SuperAdmin' ? 'Enabled' : 'Super Admin Only'})
            </span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-4">
          <span>Account created: {formatDate(adminProfile?.createdAt)}</span>
          <span>&bull;</span>
          <span>Last login: {formatDate(adminProfile?.lastLogin)}</span>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-3">
          Update Officer Profile
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Officer Full Name
            </label>
            <input
              type="text"
              id="input-profile-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                New Password <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <input
                type="password"
                id="input-new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="input-confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              id="btn-save-profile"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-[#008C45] hover:bg-[#007439] text-white text-xs sm:text-sm font-bold shadow transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Update Profile Settings'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
