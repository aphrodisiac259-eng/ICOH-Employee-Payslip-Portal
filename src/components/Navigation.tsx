import React from 'react';
import {
  FileText,
  HelpCircle,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { currentUser, adminProfile, logout } = useAuth();

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('home');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#008C45] text-white shadow-md border-b-2 border-[#006b34]">
      {/* Top Federal Bar */}
      <div className="bg-[#00602e] text-xs py-1.5 px-4 text-emerald-100 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-300"></span>
            <span>
              Federal Republic of Nigeria &bull; Parastatal Agency under Federal Ministry of Health
            </span>
          </div>

          <div className="hidden sm:block text-emerald-200 text-[11px]">
            Official Payslip Request & Verification System
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo & Identity */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center shadow-inner border border-emerald-100 group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/coat-of-arm.png"
                alt="Federal Republic of Nigeria Coat of Arms"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div className="font-extrabold tracking-tight text-white text-base sm:text-lg leading-tight">
                ICOH FOR AFRICA
              </div>

              <div className="text-[11px] sm:text-xs text-emerald-100 font-normal leading-tight opacity-90 max-w-xs sm:max-w-md line-clamp-1">
                Intercountry Centre for Oral Health (ICOH) for Africa
              </div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">

            <button
              id="nav-home-btn"
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-md transition-colors ${
                currentView === 'home'
                  ? 'bg-[#006e36] text-white font-semibold shadow-inner'
                  : 'text-emerald-50 hover:bg-[#007b3d] hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              id="nav-request-btn"
              onClick={() => handleNav('request')}
              className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                currentView === 'request' || currentView === 'confirmation'
                  ? 'bg-white text-[#008C45] font-bold shadow-md'
                  : 'bg-[#00a853] hover:bg-[#00ba5c] text-white font-semibold'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Request Payslip</span>
            </button>

            <button
              id="nav-help-btn"
              onClick={() => handleNav('help')}
              className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                currentView === 'help'
                  ? 'bg-[#006e36] text-white font-semibold shadow-inner'
                  : 'text-emerald-50 hover:bg-[#007b3d] hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Instructions / Help</span>
            </button>

            <span className="h-6 w-px bg-emerald-600/60 mx-1.5" />

            {/* Admin status / login button */}
            {currentUser ? (
              <div className="flex items-center gap-2">

                <button
                  id="nav-admin-dash-btn"
                  onClick={() => handleNav('admin')}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 ${
                    currentView === 'admin'
                      ? 'bg-white text-[#008C45] shadow'
                      : 'bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 border border-emerald-500/40'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </button>

                <button
                  id="nav-logout-btn"
                  onClick={handleLogout}
                  title="Sign out of Admin Console"
                  className="p-2 text-emerald-100 hover:text-white hover:bg-[#006e36] rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>

              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={() => handleNav('login')}
                className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 border border-emerald-400/50 transition-all ${
                  currentView === 'login'
                    ? 'bg-white text-[#008C45]'
                    : 'text-white hover:bg-[#007b3d]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Admin Login</span>
              </button>
            )}
          </nav>

          {/* Mobile menu hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="nav-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-[#006e36] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#007038] border-t border-emerald-700 px-4 pt-3 pb-4 space-y-2">

          <button
            id="mobile-nav-home"
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2.5 rounded text-white font-medium hover:bg-[#005e2e]"
          >
            Home
          </button>

          <button
            id="mobile-nav-request"
            onClick={() => handleNav('request')}
            className="w-full text-left px-3 py-2.5 rounded bg-white text-[#008C45] font-bold flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Request Payslip
          </button>

          <button
            id="mobile-nav-help"
            onClick={() => handleNav('help')}
            className="w-full text-left px-3 py-2.5 rounded text-white font-medium hover:bg-[#005e2e] flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Instructions / Help
          </button>

          <div className="pt-2 border-t border-emerald-600/50">
            {currentUser ? (
              <div className="space-y-2">

                <button
                  id="mobile-nav-admin"
                  onClick={() => handleNav('admin')}
                  className="w-full text-left px-3 py-2.5 rounded bg-emerald-900 text-white font-medium flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Console ({adminProfile?.role || 'Admin'})
                </button>

                <button
                  id="mobile-nav-logout"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded text-red-200 hover:text-white flex items-center gap-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>

              </div>
            ) : (
              <button
                id="mobile-nav-login"
                onClick={() => handleNav('login')}
                className="w-full text-left px-3 py-2.5 rounded bg-[#00582b] text-white font-medium flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Portal Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};