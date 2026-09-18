import React, { useState } from 'react';
import { 
  Building2, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Hash, 
  Mail, 
  Calendar, 
  FileEdit,
  Loader2,
  Info
} from 'lucide-react';
import { submitPayslipRequest } from '../services/requestService';

interface RequestFormProps {
  onSuccess: (referenceNumber: string, requestData: any) => void;
  onCancel: () => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onSuccess, onCancel }) => {
  // Identification type toggle: 'name' or 'ippis'
  const [idType, setIdType] = useState<'name' | 'ippis'>('name');
  
  // Form fields
  const [employeeName, setEmployeeName] = useState('');
  const [ippisNumber, setIppisNumber] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [additionalNotes, setAdditionalNotes] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Month options (standard civil service payroll format)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Year choices (current year and previous 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());

  // Email validator
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (idType === 'name') {
      if (!employeeName.trim()) {
        newErrors.employeeName = 'Please enter your official full name as registered with ICOH.';
      } else if (employeeName.trim().length < 3) {
        newErrors.employeeName = 'Full name must be at least 3 characters.';
      }
    } else {
      if (!ippisNumber.trim()) {
        newErrors.ippisNumber = 'Please enter your official IPPIS number.';
      } else if (!/^[A-Za-z0-9\-_]{4,20}$/.test(ippisNumber.trim())) {
        newErrors.ippisNumber = 'Please enter a valid IPPIS format (4-20 alphanumeric characters).';
      }
    }

    if (!officialEmail.trim()) {
      newErrors.officialEmail = 'Official email address is required.';
    } else if (!isValidEmail(officialEmail.trim())) {
      newErrors.officialEmail = 'Please provide a valid, active email address.';
    }

    if (!selectedMonth) {
      newErrors.payslipMonth = 'Please select the required payslip month.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    const formattedPayslipMonth = `${selectedMonth} ${selectedYear}`;
    const payload = {
      employeeName: idType === 'name' ? employeeName.trim() : (employeeName.trim() || `Staff (IPPIS: ${ippisNumber.trim()})`),
      ippisNumber: idType === 'ippis' ? ippisNumber.trim() : (ippisNumber.trim() || null),
      officialEmail: officialEmail.trim().toLowerCase(),
      payslipMonth: formattedPayslipMonth,
      additionalNotes: additionalNotes.trim() || null,
    };

    try {
      const result = await submitPayslipRequest(payload);
      onSuccess(result.referenceNumber, {
        ...payload,
        id: result.id,
      });
    } catch (err: any) {
      console.error('Request submission failed:', err);
      setGeneralError(
        'Unable to process your request at this moment. Please verify your connection and try again, or contact the ICOH Payroll Desk directly.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Breadcrumb / Top Title */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-100 text-[#008C45] text-xs font-bold uppercase tracking-wider mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>ICOH Payroll Desk Submission</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Employee Payslip Request Form
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
          Complete the required fields below. Your request will be queued for processing by the ICOH Payroll Desk.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8">
        
        {generalError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Submission Error</p>
              <p className="mt-0.5">{generalError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          
          {/* Section 1: Identification Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              1. Employee Identification Method <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-100 rounded-lg border border-stone-200">
              <button
                type="button"
                id="toggle-id-name"
                onClick={() => {
                  setIdType('name');
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.ippisNumber;
                    return next;
                  });
                }}
                className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  idType === 'name'
                    ? 'bg-white text-[#008C45] shadow-sm border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Employee Full Name</span>
              </button>

              <button
                type="button"
                id="toggle-id-ippis"
                onClick={() => {
                  setIdType('ippis');
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.employeeName;
                    return next;
                  });
                }}
                className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  idType === 'ippis'
                    ? 'bg-white text-[#008C45] shadow-sm border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Hash className="w-4 h-4" />
                <span>IPPIS Number</span>
              </button>
            </div>

            {/* Field based on toggle */}
            <div className="mt-3">
              {idType === 'name' ? (
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="input-employee-name"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      placeholder="e.g. Dr. Adebayo Ibrahim / Musa Maryam"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                        errors.employeeName
                          ? 'border-red-500 focus:ring-red-200 bg-red-50/30'
                          : 'border-stone-300 focus:ring-emerald-200 focus:border-[#008C45]'
                      }`}
                    />
                  </div>
                  {errors.employeeName ? (
                    <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.employeeName}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-stone-500">
                      Enter your official full name as it appears in ICOH human resource and payroll records.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="input-ippis-number"
                      value={ippisNumber}
                      onChange={(e) => setIppisNumber(e.target.value)}
                      placeholder="e.g. 102948 or IPPIS-83921"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                        errors.ippisNumber
                          ? 'border-red-500 focus:ring-red-200 bg-red-50/30'
                          : 'border-stone-300 focus:ring-emerald-200 focus:border-[#008C45]'
                      }`}
                    />
                  </div>
                  {errors.ippisNumber ? (
                    <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.ippisNumber}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-stone-500">
                      Enter your Federal Government Integrated Personnel and Payroll Information System (IPPIS) identifier.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Official Email */}
          <div>
            <label htmlFor="input-official-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              2. Official Email Address <span className="text-red-600">*</span>
            </label>
            <p className="text-[11px] text-stone-500 mb-2">
              The email address where the Payroll Desk will send your payslip
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                id="input-official-email"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                placeholder="e.g. name@icoh.gov.ng or staff@health.gov.ng"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                  errors.officialEmail
                    ? 'border-red-500 focus:ring-red-200 bg-red-50/30'
                    : 'border-stone-300 focus:ring-emerald-200 focus:border-[#008C45]'
                }`}
              />
            </div>
            {errors.officialEmail && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.officialEmail}</span>
              </p>
            )}
          </div>

          {/* Section 3: Payslip Month & Year */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              3. Payslip Month and Year <span className="text-red-600">*</span>
            </label>
            <p className="text-[11px] text-stone-500 mb-2">
              Select the specific calendar month and year for which you require the payslip
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <select
                    id="select-payslip-month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 ${
                      errors.payslipMonth
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-stone-300 focus:ring-emerald-200 focus:border-[#008C45]'
                    }`}
                  >
                    <option value="">-- Select Month --</option>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.payslipMonth && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {errors.payslipMonth}
                  </p>
                )}
              </div>

              <div>
                <select
                  id="select-payslip-year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Optional Additional Notes */}
          <div>
            <label htmlFor="textarea-notes" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              4. Additional Notes <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <p className="text-[11px] text-stone-500 mb-2">
              For any clarifying information, specific department, or remarks you wish to communicate to the Payroll Desk
            </p>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-stone-400">
                <FileEdit className="w-4 h-4" />
              </div>
              <textarea
                id="textarea-notes"
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Clinical Directorate, requesting copy for loan processing or tax audit..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#008C45]"
              ></textarea>
            </div>
          </div>

          {/* Submission Notice & Buttons */}
          <div className="pt-2 border-t border-stone-200 space-y-4">
            <div className="flex items-start gap-2 text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200/80">
              <Info className="w-4 h-4 text-[#008C45] shrink-0 mt-0.5" />
              <p>
                By submitting this form, you certify that you are an employee of ICOH and authorized to receive this personal payroll record.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                id="btn-cancel-request"
                onClick={onCancel}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium text-sm transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="btn-submit-request"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#008C45] hover:bg-[#007639] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Submission...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Payslip Request</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
