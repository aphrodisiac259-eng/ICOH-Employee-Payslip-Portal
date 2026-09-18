import React from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Building2, 
  Calendar, 
  Mail, 
  User, 
  Hash, 
  ArrowLeft, 
  PlusCircle, 
  Printer 
} from 'lucide-react';

interface RequestConfirmationProps {
  referenceNumber: string;
  requestData?: any;
  onSubmitAnother: () => void;
  onReturnHome: () => void;
}

export const RequestConfirmation: React.FC<RequestConfirmationProps> = ({
  referenceNumber,
  requestData,
  onSubmitAnother,
  onReturnHome,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-14">
      <div className="bg-white rounded-xl border border-stone-200 shadow-md overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="bg-[#008C45] text-white p-6 sm:p-8 text-center relative">
          <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mx-auto mb-4 text-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Request Submitted Successfully
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-emerald-100 font-medium">
            Intercountry Centre for Oral Health (ICOH) for Africa &bull; Payroll Desk
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Institutional Message */}
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-stone-800 text-xs sm:text-sm leading-relaxed">
            Your payslip request has been received by the ICOH Payroll Desk. Please ensure that the official email address you provided is accessible. The Payroll Desk will process your request and deliver the payslip through the appropriate official channel.
          </div>

          {/* Reference Number Highlight Card */}
          <div className="bg-stone-50 border-2 border-dashed border-emerald-600/40 rounded-xl p-5 text-center space-y-2">
            <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">
              Unique Request Reference Number
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#008C45] font-mono tracking-wide">
              {referenceNumber}
            </div>
            <p className="text-[11px] text-stone-500">
              Please preserve this reference number for any inquiries with the ICOH Payroll Desk.
            </p>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                id="btn-copy-ref"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>Copy Reference</span>
                  </>
                )}
              </button>

              <button
                id="btn-print-slip"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-stone-500" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>

          {/* Submission Details Summary */}
          {requestData && (
            <div className="border border-stone-200 rounded-lg p-4 space-y-2 text-xs">
              <h3 className="font-bold text-stone-900 border-b border-stone-100 pb-1.5 text-xs uppercase tracking-wider">
                Submission Summary
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700 pt-1">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    <strong className="font-semibold text-stone-900">Name:</strong> {requestData.employeeName}
                  </span>
                </div>

                {requestData.ippisNumber && (
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>
                      <strong className="font-semibold text-stone-900">IPPIS:</strong> {requestData.ippisNumber}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    <strong className="font-semibold text-stone-900">Email:</strong> {requestData.officialEmail}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    <strong className="font-semibold text-stone-900">Month:</strong> {requestData.payslipMonth}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              id="btn-return-home"
              onClick={onReturnHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </button>

            <button
              id="btn-submit-another"
              onClick={onSubmitAnother}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#008C45] hover:bg-[#007439] text-white text-xs font-bold shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Another Request</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
