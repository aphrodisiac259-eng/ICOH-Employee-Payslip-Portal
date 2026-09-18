import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  RefreshCw,
  Info
} from 'lucide-react';
import { AdminUser, AdminRole } from '../types';
import { collection, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form to add/invite an admin officer record
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('PayrollOfficer');
  const [submitting, setSubmitting] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'admins'));
      const list = snap.docs.map(d => ({
        ...d.data(),
        userId: d.id,
      })) as AdminUser[];
      setAdmins(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreateOrAuthorizeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!email.trim()) {
      setMsg({ type: 'error', text: 'Officer email is required.' });
      return;
    }

    setSubmitting(true);
    try {
      // Find or create in 'admins' collection by email
      const safeId = email.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
      await setDoc(doc(db, 'admins', safeId), {
        userId: safeId,
        email: email.trim().toLowerCase(),
        fullName: fullName.trim() || email.split('@')[0].toUpperCase(),
        role: selectedRole,
        createdAt: serverTimestamp(),
        isActive: true,
      }, { merge: true });

      setMsg({
        type: 'success',
        text: `Administrator profile for "${email}" registered as ${selectedRole}. They can sign in once their Firebase Authentication account is created.`
      });
      setEmail('');
      setFullName('');
      await loadAdmins();
    } catch (err: any) {
      console.error(err);
      setMsg({ type: 'error', text: 'Failed to authorize administrator record.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleRole = async (admin: AdminUser) => {
    const newRole: AdminRole = admin.role === 'SuperAdmin' ? 'PayrollOfficer' : 'SuperAdmin';
    try {
      await updateDoc(doc(db, 'admins', admin.userId), {
        role: newRole,
      });
      setMsg({ type: 'success', text: `Updated ${admin.email} to ${newRole}.` });
      await loadAdmins();
    } catch (err) {
      setMsg({ type: 'error', text: 'Error updating role.' });
    }
  };

  const handleToggleActive = async (admin: AdminUser) => {
    try {
      await updateDoc(doc(db, 'admins', admin.userId), {
        isActive: !admin.isActive,
      });
      setMsg({ type: 'success', text: `Updated status for ${admin.email}.` });
      await loadAdmins();
    } catch (err) {
      setMsg({ type: 'error', text: 'Error updating active state.' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wide mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Personnel Access Control</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Administrator Accounts &amp; Roles
          </h1>
          <p className="text-xs text-stone-600">
            Manage Payroll Desk Officers and Super Administrators authorized to handle ICOH requests.
          </p>
        </div>

        <button
          onClick={loadAdmins}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Users</span>
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
          msg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Authorize New Admin Form */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-[#008C45]" />
          <span>Authorize Official Administrator Profile</span>
        </h2>

        <form onSubmit={handleCreateOrAuthorizeAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Officer Full Name
            </label>
            <input
              type="text"
              id="new-admin-name-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ibrahim Danjuma"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Official Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="new-admin-email-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@icoh.gov.ng"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Assigned Role
            </label>
            <div className="flex gap-2">
              <select
                id="new-admin-role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-white text-stone-900 focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
              >
                <option value="PayrollOfficer">Payroll Desk Officer</option>
                <option value="SuperAdmin">Super Administrator</option>
              </select>

              <button
                type="submit"
                id="btn-register-admin"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-[#008C45] hover:bg-[#007439] text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
              >
                {submitting ? 'Saving...' : 'Authorize'}
              </button>
            </div>
          </div>
        </form>

        <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded border border-stone-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Note: Administrators must also be registered in Firebase Authentication with this email to sign in.
          </span>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200">
          <h3 className="text-sm font-bold text-stone-900">
            Registered Payroll Officers &amp; Admins ({admins.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200 text-[10px]">
              <tr>
                <th className="py-3 px-4">Officer Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {admins.map((admin) => (
                <tr key={admin.userId} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    {admin.fullName || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-600">
                    {admin.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                      admin.role === 'SuperAdmin'
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {admin.isActive !== false ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-stone-400 font-medium flex items-center gap-1 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-stone-300"></span>
                        <span>Suspended</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleRole(admin)}
                      className="px-2 py-1 rounded border border-stone-200 hover:bg-stone-100 text-[11px] font-semibold text-stone-700"
                    >
                      Switch to {admin.role === 'SuperAdmin' ? 'PayrollOfficer' : 'SuperAdmin'}
                    </button>
                    <button
                      onClick={() => handleToggleActive(admin)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                        admin.isActive !== false 
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {admin.isActive !== false ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
