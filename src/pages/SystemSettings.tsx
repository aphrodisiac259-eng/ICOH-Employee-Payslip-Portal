import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  Building2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Mail,
  ShieldCheck
} from 'lucide-react';
import { SystemSettings } from '../types';
import { fetchSystemSettings, updateSystemSettings } from '../services/requestService';

export const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [orgName, setOrgName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [location, setLocation] = useState('');
  const [turnaround, setTurnaround] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const s = await fetchSystemSettings();
        setSettings(s);
        setOrgName(s.organizationName);
        setAbbreviation(s.abbreviation);
        setSupportEmail(s.supportEmail);
        setLocation(s.payrollOfficeLocation || '');
        setTurnaround(s.processingTurnaround || '');
        setMaintenanceMode(s.maintenanceMode);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      await updateSystemSettings({
        organizationName: orgName.trim(),
        abbreviation: abbreviation.trim(),
        supportEmail: supportEmail.trim(),
        payrollOfficeLocation: location.trim(),
        processingTurnaround: turnaround.trim(),
        maintenanceMode,
      });
      setMsg({ type: 'success', text: 'System settings saved and applied across the portal.' });
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Failed to update system settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wide mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>System Configuration</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          Portal &amp; Organization Settings
        </h1>
        <p className="text-xs text-stone-600">
          Super Administrator parameters for institutional branding, service turnaround, and support coordinates.
        </p>
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

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        <h2 className="text-sm font-extrabold text-stone-900 border-b border-stone-200 pb-3">
          Institutional Brand &amp; Identity
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Organization Full Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Official Abbreviation
              </label>
              <input
                type="text"
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Support &amp; Inquiries Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Headquarters Office Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Standard Turnaround Time
              </label>
              <input
                type="text"
                value={turnaround}
                onChange={(e) => setTurnaround(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Toggle */}
        <div className="pt-4 border-t border-stone-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="mt-0.5 rounded border-stone-300 text-[#008C45] focus:ring-emerald-200"
            />
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                Emergency Maintenance Mode
              </span>
              <span className="text-[11px] text-stone-500">
                When enabled, displays an informational notice on the public request form.
              </span>
            </div>
          </label>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="submit"
            id="btn-save-settings"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[#008C45] hover:bg-[#007439] text-white text-xs sm:text-sm font-bold shadow transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
