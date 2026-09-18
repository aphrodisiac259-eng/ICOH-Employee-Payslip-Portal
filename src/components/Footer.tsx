import React from 'react';
import { Building2, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t-4 border-[#008C45] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Org Identification */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#008C45] flex items-center justify-center text-white font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base tracking-tight">
                  INTERCOUNTRY CENTRE FOR ORAL HEALTH (ICOH) FOR AFRICA
                </h3>
                <p className="text-xs text-stone-400">
                  Federal Republic of Nigeria &bull; Regional WHO Collaborating Centre
                </p>
              </div>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed max-w-lg">
              The ICOH Employee Payslip Request Portal enables verified staff and officers of the Intercountry Centre for Oral Health for Africa to submit institutional requests for monthly payslip records directly to the internal Payroll Desk.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ICOH Payroll Desk & Official Dispatch Service Active</span>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider border-b border-stone-800 pb-2">
              Payroll Desk Office
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>ICOH Complex, Jos, Plateau State, Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>payroll@icoh.gov.ng</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Official Working Hours: 8:00 AM - 4:00 PM (WAT)</span>
              </li>
            </ul>
          </div>

          {/* Quick Links & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider border-b border-stone-800 pb-2">
              Administrative Desk
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Authorized payroll officers and administrators may access the secured processing console.
            </p>
            <button
              id="footer-admin-link"
              onClick={onAdminClick}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold bg-stone-800/80 hover:bg-stone-800 px-3 py-2 rounded border border-emerald-900/50 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Payroll Officer Sign-In &rarr;</span>
            </button>
          </div>

        </div>

        {/* Bottom Legal & Rights */}
        <div className="mt-10 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Intercountry Centre for Oral Health (ICOH) for Africa. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Official Federal Republic of Nigeria Public Service Portal</span>
            <span className="text-stone-700">&bull;</span>
            <span>Ref: FG-ICOH-PAYROLL-PORTAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
