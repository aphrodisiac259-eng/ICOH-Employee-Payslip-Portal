import React from 'react';
import {
  Inbox,
  Clock,
  Hourglass,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { PayslipRequest, RequestStatus } from '../types';

interface AdminDashboardProps {
  requests: PayslipRequest[];
  loading: boolean;
  onRefresh: () => void;
  onSelectRequest: (req: PayslipRequest) => void;
  onViewAllRequests: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  requests,
  loading,
  onRefresh,
  onSelectRequest,
  onViewAllRequests
}) => {
  const total = requests.length;

  const pending = requests.filter(
    (r) => r.status === 'Pending'
  ).length;

  const processing = requests.filter(
    (r) => r.status === 'Processing'
  ).length;

  const completed = requests.filter(
    (r) => r.status === 'Completed/Sent'
  ).length;

  const attention = requests.filter(
    (r) =>
      r.status === 'Requires Clarification' ||
      r.status === 'Rejected'
  ).length;

  const currentMonthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const currentMonthCount = requests.filter((r) =>
    r.payslipMonth?.includes(currentMonthName.split(' ')[0])
  ).length;

  const recentRequests = requests.slice(0, 6);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">
            Pending
          </span>
        );

      case 'Processing':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap">
            Processing
          </span>
        );

      case 'Completed/Sent':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">
            Completed / Sent
          </span>
        );

      case 'Requires Clarification':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200 whitespace-nowrap">
            Clarification
          </span>
        );

      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 whitespace-nowrap">
            Rejected
          </span>
        );

      default:
        return null;
    }
  };

  const formatDate = (val: any) => {
    if (!val) return '—';

    try {
      const date = val.toDate ? val.toDate() : new Date(val);

      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Payroll Desk Operations Dashboard
          </h1>

          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Real-time status overview of employee payslip requests,
            queue loads, and processing metrics.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row sm:flex-row gap-2 w-full sm:w-auto">
          <button
            id="dash-refresh-btn"
            onClick={onRefresh}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-sm transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-stone-500 ${
                loading ? 'animate-spin' : ''
              }`}
            />

            <span>Refresh Queue</span>
          </button>

          <button
            id="dash-view-all-btn"
            onClick={onViewAllRequests}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#008C45] hover:bg-[#007439] text-white text-xs font-bold shadow-sm transition-colors"
          >
            <span>Open All Requests</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {/* Total */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-sm space-y-1 min-w-0">
          <div className="flex items-center justify-between gap-2 text-stone-500">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">
              Total
            </span>
            <Inbox className="w-4 h-4 shrink-0 text-stone-400" />
          </div>

          <div className="text-2xl font-black text-stone-900">
            {total}
          </div>

          <div className="text-[10px] text-stone-500 truncate">
            All submissions
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-amber-200/80 shadow-sm space-y-1 bg-gradient-to-b from-amber-50/20 to-white min-w-0">
          <div className="flex items-center justify-between gap-2 text-amber-700">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">
              Pending
            </span>
            <Clock className="w-4 h-4 shrink-0 text-amber-500" />
          </div>

          <div className="text-2xl font-black text-amber-900">
            {pending}
          </div>

          <div className="text-[10px] text-amber-700/80 font-medium truncate">
            Awaiting action
          </div>
        </div>

        {/* Processing */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-blue-200/80 shadow-sm space-y-1 bg-gradient-to-b from-blue-50/20 to-white min-w-0">
          <div className="flex items-center justify-between gap-2 text-blue-700">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">
              Processing
            </span>
            <Hourglass className="w-4 h-4 shrink-0 text-blue-500" />
          </div>

          <div className="text-2xl font-black text-blue-900">
            {processing}
          </div>

          <div className="text-[10px] text-blue-700/80 font-medium truncate">
            In handling
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-emerald-200/80 shadow-sm space-y-1 bg-gradient-to-b from-emerald-50/20 to-white min-w-0">
          <div className="flex items-center justify-between gap-2 text-[#008C45]">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          </div>

          <div className="text-2xl font-black text-emerald-950">
            {completed}
          </div>

          <div className="text-[10px] text-emerald-700 font-medium truncate">
            Payslip emailed
          </div>
        </div>

        {/* Attention */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-orange-200/80 shadow-sm space-y-1 bg-gradient-to-b from-orange-50/20 to-white min-w-0">
          <div className="flex items-center justify-between gap-2 text-orange-700">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">
              Attention
            </span>
            <AlertTriangle className="w-4 h-4 shrink-0 text-orange-500" />
          </div>

          <div className="text-2xl font-black text-orange-950">
            {attention}
          </div>

          <div className="text-[10px] text-orange-700/80 font-medium truncate">
            Clarify / Reject
          </div>
        </div>

        {/* Current Month */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-sm space-y-1 min-w-0">
          <div className="flex items-center justify-between gap-2 text-stone-500">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">
              This Month
            </span>
            <Calendar className="w-4 h-4 shrink-0 text-stone-400" />
          </div>

          <div className="text-2xl font-black text-stone-900">
            {currentMonthCount}
          </div>

          <div className="text-[10px] text-stone-500 truncate">
            {currentMonthName}
          </div>
        </div>
      </div>

      {/* Workflow Reminder */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-sm flex flex-col gap-4">
        <div className="min-w-0">
          <div className="text-xs font-bold text-[#008C45] uppercase tracking-wide">
            Official Workflow Reminder for Officers
          </div>

          <p className="text-xs text-stone-600 leading-relaxed mt-1">
            1. Open request &rarr; 2. Retrieve PDF from local payroll
            archive &rarr; 3. Send to official email via ICOH mail client
            &rarr; 4. Update request status to{' '}
            <strong>Completed/Sent</strong>.
          </p>
        </div>

        <button
          id="dash-quick-pending-btn"
          onClick={onViewAllRequests}
          className="w-full sm:w-auto self-stretch sm:self-start px-4 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#008C45] border border-emerald-200 text-xs font-bold transition-colors"
        >
          Process {pending} Pending Requests &rarr;
        </button>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden min-w-0">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-stone-900">
              Recent Incoming Requests
            </h2>

            <p className="text-[11px] text-stone-500 mt-0.5">
              Showing the latest submissions received by the Payroll Desk
            </p>
          </div>

          <button
            onClick={onViewAllRequests}
            className="self-start sm:self-auto text-xs font-bold text-[#008C45] hover:underline whitespace-nowrap"
          >
            View Full Queue ({total})
          </button>
        </div>

        {recentRequests.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-stone-500">
            <Inbox className="w-10 h-10 mx-auto text-stone-300 mb-2" />

            <p className="text-sm font-semibold text-stone-700">
              No payslip requests found
            </p>

            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto leading-relaxed">
              When employees submit payslip requests through the public
              portal, they will appear here.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200 text-[10px]">
                <tr>
                  <th className="py-3 px-4 whitespace-nowrap">
                    Employee Name
                  </th>

                  <th className="py-3 px-4 whitespace-nowrap">
                    IPPIS No.
                  </th>

                  <th className="py-3 px-4 whitespace-nowrap">
                    Official Email
                  </th>

                  <th className="py-3 px-4 whitespace-nowrap">
                    Payslip Month
                  </th>

                  <th className="py-3 px-4 whitespace-nowrap">
                    Date Requested
                  </th>

                  <th className="py-3 px-4 whitespace-nowrap">
                    Current Status
                  </th>

                  <th className="py-3 px-4 text-right whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {recentRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-stone-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900 whitespace-nowrap">
                        {req.employeeName}
                      </div>

                      <div className="text-[10px] font-mono text-stone-500 whitespace-nowrap">
                        {req.referenceNumber}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                      {req.ippisNumber || (
                        <span className="text-stone-400 italic">
                          Not provided
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                      {req.officialEmail}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-800 whitespace-nowrap">
                      {req.payslipMonth}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                      {formatDate(req.createdAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {getStatusBadge(req.status)}

                        {req.isDuplicate && (
                          <span
                            className="text-[10px] bg-red-100 text-red-800 px-1 rounded font-bold"
                            title="Potential Duplicate Request"
                          >
                            DUP
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        id={`dash-action-btn-${req.id}`}
                        onClick={() => onSelectRequest(req)}
                        className="px-2.5 py-1.5 rounded bg-[#008C45] hover:bg-[#007439] text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
                      >
                        Manage
                      </button>
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