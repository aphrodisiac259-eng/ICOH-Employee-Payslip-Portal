import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  User, 
  Hash, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Save, 
  Send, 
  AlertTriangle, 
  XCircle, 
  Hourglass,
  Upload,
  Paperclip,
  History,
  ShieldCheck,
  Check
} from 'lucide-react';
import { PayslipRequest, RequestStatus } from '../types';
import { updateRequestStatusAndNotes } from '../services/requestService';
import { useAuth } from '../contexts/AuthContext';

interface RequestDetailsProps {
  request: PayslipRequest;
  onBack: () => void;
  onUpdated: (updatedReq: PayslipRequest) => void;
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({
  request,
  onBack,
  onUpdated,
}) => {
  const { currentUser, adminProfile } = useAuth();

  // Form states
  const [currentStatus, setCurrentStatus] = useState<RequestStatus>(request.status);
  const [internalNotes, setInternalNotes] = useState<string>(request.internalNotes || '');
  const [documentName, setDocumentName] = useState<string>(request.payslipDocumentName || '');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  // UX states
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const adminName = adminProfile?.fullName || currentUser?.email || 'Payroll Officer';
  const adminId = currentUser?.uid || 'admin-system';
  const adminEmail = currentUser?.email || 'admin@icoh.gov.ng';

  const formatTimestamp = (val: any) => {
    if (!val) return '—';
    try {
      const date = val.toDate ? val.toDate() : new Date(val);
      return date.toLocaleString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  const handleSave = async (overrideStatus?: RequestStatus) => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const statusToApply = overrideStatus || currentStatus;

    try {
      await updateRequestStatusAndNotes({
        requestId: request.id,
        referenceNumber: request.referenceNumber,
        previousStatus: request.status,
        newStatus: statusToApply,
        internalNotes: internalNotes.trim() || null,
        adminId,
        adminEmail,
        adminName,
        documentName: attachedFileName || documentName || null,
      });

      const updatedRecord: PayslipRequest = {
        ...request,
        status: statusToApply,
        internalNotes: internalNotes.trim() || null,
        processedBy: adminId,
        processedByName: adminName,
        processedAt: statusToApply === 'Completed/Sent' ? new Date() : request.processedAt,
        payslipDocumentName: attachedFileName || documentName || request.payslipDocumentName,
      };

      setCurrentStatus(statusToApply);
      onUpdated(updatedRecord);
      setSuccessMsg(`Request successfully updated to "${statusToApply}". Action logged.`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Update request error:', err);
      setErrorMsg('Failed to update request status. Please verify permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFileName(file.name);
      setDocumentName(file.name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-queue"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-mono">
            {request.referenceNumber}
          </span>
        </div>
      </div>

      {/* Notification banners */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Duplicate alert if detected */}
      {request.isDuplicate && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Duplicate Alert:</span> Another request for the same employee/email and month was previously logged ({request.duplicateOf || 'similar record'}). Please check before dispatching.
          </div>
        </div>
      )}

      {/* Main Request Information Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#008C45] uppercase tracking-wider mb-1">
              <span>ICOH Employee Payslip File</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">
              {request.employeeName}
            </h1>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Reference: {request.referenceNumber}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase font-bold text-stone-500 block mb-1">
              Current Status
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-300">
              {request.status}
            </span>
          </div>
        </div>

        {/* Essential Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          
          <div className="space-y-1">
            <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              IPPIS Number
            </span>
            <div className="font-bold text-stone-900 text-sm font-mono">
              {request.ippisNumber || <span className="text-stone-400 font-normal italic">Not provided</span>}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              Official Staff Email
            </span>
            <div className="font-bold text-stone-900 text-sm">
              <a 
                href={`mailto:${request.officialEmail}?subject=ICOH Payslip (${request.payslipMonth}) - Ref ${request.referenceNumber}`}
                className="text-[#008C45] hover:underline"
              >
                {request.officialEmail}
              </a>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              Requested Payslip Month
            </span>
            <div className="font-bold text-stone-900 text-sm">
              {request.payslipMonth}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              Request Submission Timestamp
            </span>
            <div className="text-stone-800 font-medium">
              {formatTimestamp(request.createdAt)}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              Last Processed By
            </span>
            <div className="text-stone-800 font-medium">
              {request.processedByName || request.processedBy || 'Not yet processed'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              Processed Date
            </span>
            <div className="text-stone-800 font-medium">
              {formatTimestamp(request.processedAt || request.updatedAt)}
            </div>
          </div>

        </div>

        {/* Employee's Additional Notes (if any) */}
        {request.additionalNotes && (
          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-1 text-xs">
            <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">
              Employee Note / Remarks:
            </span>
            <p className="text-stone-700 italic">
              "{request.additionalNotes}"
            </p>
          </div>
        )}

      </div>

      {/* Admin Action & Workflow Panel */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="border-b border-stone-200 pb-4">
          <h2 className="text-base font-extrabold text-stone-900">
            Payroll Officer Processing &amp; Status Control
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Follow standard ICOH procedure: retrieve payslip PDF from local storage, send via external mail, and update record status.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Quick Actions
          </label>
          <div className="flex flex-wrap gap-2">
            
            <button
              id="action-mark-processing"
              type="button"
              onClick={() => handleSave('Processing')}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-colors"
            >
              <Hourglass className="w-3.5 h-3.5 text-blue-600" />
              <span>Mark as Processing</span>
            </button>

            <button
              id="action-mark-completed"
              type="button"
              onClick={() => handleSave('Completed/Sent')}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark as Completed / Sent</span>
            </button>

            <button
              id="action-flag-clarification"
              type="button"
              onClick={() => handleSave('Requires Clarification')}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200 text-xs font-bold transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
              <span>Flag for Clarification</span>
            </button>

            <button
              id="action-reject"
              type="button"
              onClick={() => handleSave('Rejected')}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-800 hover:bg-red-100 border border-red-200 text-xs font-bold transition-colors"
            >
              <XCircle className="w-3.5 h-3.5 text-red-600" />
              <span>Reject Request</span>
            </button>

          </div>
        </div>

        {/* Detailed Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          
          {/* Status Dropdown */}
          <div>
            <label htmlFor="select-status-control" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Change Status Dropdown
            </label>
            <select
              id="select-status-control"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value as RequestStatus)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm bg-white text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed/Sent">Completed/Sent</option>
              <option value="Requires Clarification">Requires Clarification</option>
              <option value="Rejected">Rejected</option>
            </select>
            <p className="text-[11px] text-stone-500 mt-1">
              Select status to update the processing lifecycle.
            </p>
          </div>

          {/* Optional internal record-keeping filename attachment */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Attach Local File Name <span className="text-stone-400 font-normal">(Optional internal tracking)</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-700 transition-colors">
                <Upload className="w-4 h-4 text-stone-500" />
                <span>Select file to log name</span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleLocalFileSelect} 
                  className="hidden" 
                />
              </label>
              {(attachedFileName || documentName) && (
                <span className="text-xs text-stone-600 truncate flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-stone-900">{attachedFileName || documentName}</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Internal record metadata. Payslips are sent via external official email.
            </p>
          </div>

        </div>

        {/* Internal Processing Notes */}
        <div>
          <label htmlFor="internal-notes-textarea" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Internal Processing Notes / Remarks
          </label>
          <textarea
            id="internal-notes-textarea"
            rows={3}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="e.g. Verified IPPIS with salary schedule; dispatched payslip PDF at 11:45 AM via official mail desk..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
          ></textarea>
        </div>

        {/* Save button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            id="btn-save-request-changes"
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[#008C45] hover:bg-[#007439] text-white text-xs sm:text-sm font-bold shadow transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Updates...' : 'Save Updates & Record Log'}</span>
          </button>
        </div>

      </div>

      {/* Audit & Processing Timeline Box */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-extrabold text-sm">
          <History className="w-4 h-4 text-[#008C45]" />
          <span>Processing Timeline &amp; Accountability Record</span>
        </div>

        <div className="border-l-2 border-emerald-500/40 ml-2 pl-4 space-y-4 text-xs">
          
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008C45] absolute -left-[21px] top-1"></span>
            <div className="font-bold text-stone-900">
              Request Received in Portal
            </div>
            <div className="text-[11px] text-stone-500">
              {formatTimestamp(request.createdAt)} &bull; Automated Reference: {request.referenceNumber}
            </div>
          </div>

          {request.processedAt && (
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 absolute -left-[21px] top-1"></span>
              <div className="font-bold text-stone-900">
                Processed as {request.status}
              </div>
              <div className="text-[11px] text-stone-500">
                {formatTimestamp(request.processedAt)} &bull; Officer: {request.processedByName || request.processedBy}
              </div>
              {request.internalNotes && (
                <p className="mt-1 text-[11px] text-stone-600 bg-stone-50 p-2 rounded border border-stone-200">
                  Notes: {request.internalNotes}
                </p>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
