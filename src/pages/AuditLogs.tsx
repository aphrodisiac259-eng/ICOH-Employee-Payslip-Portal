import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Search, 
  Filter, 
  Clock, 
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { AuditLog } from '../types';
import { fetchAuditLogs } from '../services/requestService';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.adminEmail?.toLowerCase().includes(term) ||
      log.action?.toLowerCase().includes(term) ||
      log.referenceNumber?.toLowerCase().includes(term) ||
      log.details?.toLowerCase().includes(term)
    );
  });

  const formatTimestamp = (val: any) => {
    if (!val) return '—';
    try {
      const date = val.toDate ? val.toDate() : new Date(val);
      return date.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wide mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Super Administrator Audit Trail</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Security &amp; Action Audit Logs
          </h1>
          <p className="text-xs text-stone-600">
            Immutable tracking record of all administrator status modifications, processing entries, and system notes.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="audit-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by admin email, action description, reference number..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-600"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <ShieldAlert className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-semibold text-stone-700">No audit log entries recorded yet</p>
            <p className="text-xs text-stone-500 mt-1">
              Actions performed by Payroll Officers (updating statuses, adding internal notes) will be automatically captured here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200 text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp (WAT)</th>
                  <th className="py-3 px-4">Officer / Administrator</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4">Request Ref</th>
                  <th className="py-3 px-4">Previous &rarr; New</th>
                  <th className="py-3 px-4">Details &amp; Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-900">
                      {log.adminEmail}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#008C45]">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-600">
                      {log.referenceNumber || '—'}
                    </td>
                    <td className="py-3 px-4">
                      {log.previousStatus && log.newStatus ? (
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-stone-500">{log.previousStatus}</span>
                          <span className="text-stone-400">&rarr;</span>
                          <span className="font-bold text-stone-900">{log.newStatus}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-xs truncate" title={log.details}>
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
