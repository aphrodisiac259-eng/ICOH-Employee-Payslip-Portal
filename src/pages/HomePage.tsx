import React from 'react';
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldAlert, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Award
} from 'lucide-react';

interface HomePageProps {
  onStartRequest: () => void;
  onViewHelp: () => void;
  onAdminLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onStartRequest, 
  onViewHelp, 
  onAdminLogin 
}) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-stone-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:py-20">
          <div className="max-w-3xl space-y-6">
            
            {/* Agency Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-100/80 border border-emerald-300/70 text-[#008C45] text-xs font-bold tracking-wide uppercase">
              <Building2 className="w-4 h-4 text-[#008C45]" />
              <span>INTERCOUNTRY CENTRE FOR ORAL HEALTH (ICOH) FOR AFRICA</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-[1.15]">
              ICOH Employee <br />
              <span className="text-[#008C45]">Payslip Request Portal</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl font-normal">
              Request your monthly payslip quickly and conveniently through the ICOH Payroll Desk. Submissions are securely verified and processed directly to your official staff email.
            </p>

            {/* CTA Button Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                id="hero-request-cta-btn"
                onClick={onStartRequest}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#008C45] hover:bg-[#007b3d] text-white font-bold text-base shadow-sm hover:shadow transition-all duration-150 active:scale-[0.99] focus:ring-4 focus:ring-emerald-200"
              >
                <FileText className="w-5 h-5" />
                <span>Request Payslip</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                id="hero-help-btn"
                onClick={onViewHelp}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 font-semibold text-sm border border-stone-300 transition-colors"
              >
                <span>Help &amp; Guidelines</span>
              </button>
            </div>

            {/* Quick Guarantees Pill */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-stone-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#008C45]" />
                <span>No password required for employees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#008C45]" />
                <span>Verified via IPPIS or Staff Name</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#008C45]" />
                <span>Fast Payroll Desk turnaround</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-[#008C45] uppercase tracking-widest mb-1.5">
            Simple 4-Step Process
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            How the ICOH Payslip Request System Works
          </h3>
          <p className="mt-2 text-sm text-stone-600">
            Understand how your request is validated, prepared by payroll desk staff, and dispatched to your email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:border-emerald-300 transition-colors relative flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#008C45] font-black text-sm flex items-center justify-center mb-4">
              01
            </div>
            <h4 className="font-bold text-stone-900 text-base mb-2">
              Submit Request
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed flex-1">
              Select your identification (Employee Name or IPPIS Number), enter your active official email, choose the payslip month/year, and submit.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Instant Reference Generated
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:border-emerald-300 transition-colors relative flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#008C45] font-black text-sm flex items-center justify-center mb-4">
              02
            </div>
            <h4 className="font-bold text-stone-900 text-base mb-2">
              Payroll Desk Reviews Request
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed flex-1">
              Designated ICOH payroll officers review pending requests in the administrative queue and verify employee records against payroll archives.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Checked for Duplicates
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:border-emerald-300 transition-colors relative flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#008C45] font-black text-sm flex items-center justify-center mb-4">
              03
            </div>
            <h4 className="font-bold text-stone-900 text-base mb-2">
              Payslip Is Processed
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed flex-1">
              The assigned officer retrieves the official payslip document from the secure payroll archives for the requested period.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Confidential Handling
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:border-emerald-300 transition-colors relative flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#008C45] font-black text-sm flex items-center justify-center mb-4">
              04
            </div>
            <h4 className="font-bold text-stone-900 text-base mb-2">
              Payslip Is Sent to Official Email
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed flex-1">
              The payslip is transmitted directly to the employee's official email address via the ICOH internal mailing system, and request status is finalized.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Send className="w-3.5 h-3.5" /> Sent to Official Mail
            </div>
          </div>

        </div>
      </section>

      {/* Important Notice Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-bold text-amber-950">
                Official Guidelines &amp; Important Notice for All Staff
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                Please take note of the following operational policies regarding the ICOH Employee Payslip Request Portal:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-900 leading-relaxed">
                <li>
                  <strong className="font-semibold">Official Email Delivery Only:</strong> Ensure you provide an accessible official email address. Due to privacy and civil service regulations, payslips cannot be dispatched to unverified personal channels without verification.
                </li>
                <li>
                  <strong className="font-semibold">Request &amp; Processing Scope:</strong> This portal manages request logging and queue processing. Actual payslip documents are transmitted separately by authorized Payroll Officers via institutional mail.
                </li>
                <li>
                  <strong className="font-semibold">One Request Per Month:</strong> Submitting multiple identical requests for the same month will be flagged as duplicate records by the system.
                </li>
              </ul>
              <div className="pt-2">
                <button
                  id="notice-request-btn"
                  onClick={onStartRequest}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008C45] hover:underline"
                >
                  Proceed to submission form &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Callout banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-stone-900 text-stone-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-stone-800">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4" />
              <span>ICOH Payroll Desk Personnel</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Are you an authorized ICOH Payroll Officer or Super Admin?
            </h3>
            <p className="text-xs text-stone-400 max-w-xl">
              Access the secure console to review queued employee submissions, record processing timestamps, and manage request statuses.
            </p>
          </div>
          <button
            id="callout-admin-login-btn"
            onClick={onAdminLogin}
            className="shrink-0 px-5 py-3 rounded-lg bg-[#008C45] hover:bg-[#00793b] text-white text-xs font-bold transition-colors shadow"
          >
            Access Admin Console
          </button>
        </div>
      </section>

    </div>
  );
};
