import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ShieldCheck, 
  Mail, 
  CheckCircle2, 
  AlertTriangle,
  Building2
} from 'lucide-react';

interface HelpPageProps {
  onStartRequest: () => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onStartRequest }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Who is eligible to request a payslip through this portal?',
      a: 'All confirmed, contract, and designated personnel of the Intercountry Centre for Oral Health (ICOH) for Africa with valid personnel records and official government / organizational email addresses can submit requests.',
    },
    {
      q: 'Can I receive the payslip directly into my personal email (e.g., Gmail, Yahoo)?',
      a: 'Due to Federal Civil Service data protection directives and the sensitivity of payroll records, the ICOH Payroll Desk delivers payslips to official registered staff emails. If you require special dispensation, please contact the ICOH Administration & Human Resources Directorate in Jos.',
    },
    {
      q: 'How long does it take for a request to be processed?',
      a: 'Standard requests are processed by the Payroll Desk within 24 to 48 working hours (Monday to Friday, 8:00 AM to 4:00 PM WAT).',
    },
    {
      q: 'What should I do if I forgot or do not have my IPPIS number?',
      a: 'You can toggle the identification field to "Employee Full Name" on the submission form and provide your full official surname and other names as registered with ICOH.',
    },
    {
      q: 'Can I submit requests for multiple months at once?',
      a: 'Each submission is processed for an individual month to ensure accurate archive retrieval and audit logging. If you need payslips for several months, you can submit separate requests using the reference number generator.',
    },
    {
      q: 'What does "Requires Clarification" or "Rejected" status mean?',
      a: 'If a request cannot be verified (for example, if the employee name does not match IPPIS archives, or the requested month pre-dates employment), the Payroll Desk officer flags it. You can contact payroll@icoh.gov.ng citing your Request Reference Number.',
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-100 text-[#008C45] text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Help &amp; Operational Instructions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Employee Guidance &amp; FAQ
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-stone-600">
          Everything you need to know about requesting, tracking, and receiving your ICOH monthly payslips.
        </p>
      </div>

      {/* Process Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded bg-emerald-50 text-[#008C45] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">
            1. Form Submission
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Ensure your official name, IPPIS (if available), and active staff email are typed without typographical errors.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded bg-emerald-50 text-[#008C45] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">
            2. Desk Audit &amp; Verification
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            The assigned payroll desk officer cross-checks the request against civil service salary schedules and archives.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded bg-emerald-50 text-[#008C45] flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-sm">
            3. Delivery to Official Email
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Your encrypted payslip document is sent directly from the official ICOH payroll desk email account.
          </p>
        </div>
      </div>

      {/* Accordion FAQs */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-3">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-stone-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between text-xs sm:text-sm font-bold text-stone-800 hover:text-[#008C45] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-500 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Notice */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-stone-900">
            Still need assistance with your payroll inquiry?
          </h4>
          <p className="text-xs text-stone-600">
            Contact the ICOH Payroll Desk directly at <span className="font-semibold text-stone-900">payroll@icoh.gov.ng</span> or visit the Administrative Block, Jos.
          </p>
        </div>

        <button
          onClick={onStartRequest}
          className="shrink-0 px-5 py-2.5 rounded-lg bg-[#008C45] hover:bg-[#007439] text-white text-xs font-bold transition-colors shadow-sm"
        >
          Submit Request Now
        </button>
      </div>

    </div>
  );
};
