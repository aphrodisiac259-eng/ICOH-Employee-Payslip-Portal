import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Eye, 
  Calendar,
  CheckCircle2,
  Clock,
  Hourglass,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { PayslipRequest, RequestStatus } from '../types';

interface RequestListProps {
  requests: PayslipRequest[];
  onSelectRequest: (req: PayslipRequest) => void;
  onRefresh: () => void;
}

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  onSelectRequest,
  onRefresh,
}) => {
  // Filters and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'dateDesc' | 'dateAsc' | 'nameAsc' | 'status'>('dateDesc');
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Derive distinct payslip months for filter
  const distinctMonths = useMemo(() => {
    const set = new Set<string>();
    requests.forEach(r => {
      if (r.payslipMonth) set.add(r.payslipMonth);
    });
    return Array.from(set).sort();
  }, [requests]);

  // Filtering and Sorting
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Search matching: Employee name, IPPIS, Email, Reference Number
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = req.employeeName?.toLowerCase().includes(term);
        const matchesEmail = req.officialEmail?.toLowerCase().includes(term);
        const matchesIppis = req.ippisNumber?.toLowerCase().includes(term);
        const matchesRef = req.referenceNumber?.toLowerCase().includes(term);
        if (!matchesName && !matchesEmail && !matchesIppis && !matchesRef) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'ALL' && req.status !== statusFilter) {
        return false;
      }

      // Month filter
      if (monthFilter !== 'ALL' && req.payslipMonth !== monthFilter) {
        return false;
      }

      // Duplicates filter
      if (showDuplicatesOnly && !req.isDuplicate) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'dateDesc') {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      } else if (sortBy === 'dateAsc') {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeA - timeB;
      } else if (sortBy === 'nameAsc') {
        return (a.employeeName || '').localeCompare(b.employeeName || '');
      } else if (sortBy === 'status') {
        return (a.status || '').localeCompare(b.status || '');
      }
      return 0;
    });
  }, [requests, searchTerm, statusFilter, monthFilter, sortBy, showDuplicatesOnly]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRequests.length / pageSize) || 1;
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, currentPage, pageSize]);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Pending
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Processing
          </span>
        );
      case 'Completed/Sent':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Completed / Sent
          </span>
        );
      case 'Requires Clarification':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
            Clarification
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
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
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '—';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            All Payslip Requests
          </h1>
          <p className="text-xs text-stone-600">
            Filter, inspect, and update employee request statuses across the organization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">
            Showing {filteredRequests.length} of {requests.length} records
          </span>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="search-requests-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Employee Name, IPPIS, Email, or Ref #..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Processing">Processing</option>
              <option value="Completed/Sent">Completed / Sent</option>
              <option value="Requires Clarification">Requires Clarification</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <select
              id="filter-month-select"
              value={monthFilter}
              onChange={(e) => {
                setMonthFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
            >
              <option value="ALL">All Payslip Months</option>
              {distinctMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Secondary Row: Sorting, Duplicate Flag, Page Size */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs text-stone-600">
          
          <div className="flex flex-wrap items-center gap-4">
            
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-stone-700">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-stone-900 focus:outline-none border-b border-stone-300 pb-0.5"
              >
                <option value="dateDesc">Newest Request First</option>
                <option value="dateAsc">Oldest Request First</option>
                <option value="nameAsc">Employee Name (A-Z)</option>
                <option value="status">Status</option>
              </select>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                id="checkbox-duplicates-only"
                checked={showDuplicatesOnly}
                onChange={(e) => {
                  setShowDuplicatesOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-stone-300 text-[#008C45] focus:ring-emerald-200"
              />
              <span className="font-semibold text-amber-900">Show Flagged Duplicates Only</span>
            </label>

          </div>

          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-stone-200 rounded px-2 py-1 bg-white font-medium"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

        </div>

      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {paginatedRequests.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-2" />
            <p className="text-sm font-semibold text-stone-800">No requests match your filters</p>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your search keywords, status filter, or clearing the duplicate flag.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setMonthFilter('ALL');
                setShowDuplicatesOnly(false);
              }}
              className="mt-4 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200 text-[10px]">
                <tr>
                  <th className="py-3 px-4">Reference &amp; Employee</th>
                  <th className="py-3 px-4">IPPIS No.</th>
                  <th className="py-3 px-4">Official Email</th>
                  <th className="py-3 px-4">Payslip Month</th>
                  <th className="py-3 px-4">Date Submitted</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {paginatedRequests.map((req) => (
                  <tr 
                    key={req.id} 
                    className={`hover:bg-emerald-50/40 transition-colors ${
                      req.isDuplicate ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{req.employeeName}</div>
                      <div className="text-[10px] font-mono text-stone-500">{req.referenceNumber}</div>
                      {req.isDuplicate && (
                        <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-amber-800 font-semibold bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Possible duplicate ({req.duplicateOf || 'similar'})</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-mono">
                      {req.ippisNumber || <span className="text-stone-400 italic">None</span>}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {req.officialEmail}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-800">
                      {req.payslipMonth}
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {formatDate(req.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        id={`btn-open-request-${req.id}`}
                        onClick={() => onSelectRequest(req)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#008C45] hover:bg-[#007439] text-white text-xs font-semibold shadow-sm transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 bg-stone-50">
            <div>
              Page <span className="font-bold text-stone-900">{currentPage}</span> of{' '}
              <span className="font-bold text-stone-900">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="pagination-prev-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 rounded border border-stone-300 bg-white text-stone-700 disabled:opacity-40 hover:bg-stone-100 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <button
                id="pagination-next-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 rounded border border-stone-300 bg-white text-stone-700 disabled:opacity-40 hover:bg-stone-100 transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
