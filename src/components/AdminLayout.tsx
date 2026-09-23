import React, { useState } from 'react';
import {
  Building2,
  LayoutDashboard,
  ListFilter,
  UserCheck,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onExitToPublic: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitToPublic,
  children
}) => {
  const { adminProfile, role, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isSuperAdmin = role === 'SuperAdmin';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard
    },
    {
      id: 'requests',
      label: 'All Requests Queue',
      icon: ListFilter
    },
    {
      id: 'profile',
      label: 'My Admin Profile',
      icon: UserCheck
    },
    ...(isSuperAdmin
      ? [
          {
            id: 'audit',
            label: 'Audit Logs',
            icon: ShieldAlert
          },
          {
            id: 'admins',
            label: 'Admin Officers',
            icon: Building2
          },
          {
            id: 'settings',
            label: 'System Settings',
            icon: Settings
          }
        ]
      : [])
  ];

  const handleMobileNavigation = (tab: string) => {
    onSelectTab(tab);
    setMobileNavOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    onExitToPublic();
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Federal Bar */}
      <div className="bg-[#005a2b] text-emerald-100 text-xs py-1.5 px-3 sm:px-6 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-400" />

            <span className="font-semibold tracking-wide truncate">
              ICOH SECURE ADMINISTRATIVE CONSOLE
            </span>

            <span className="hidden md:inline text-emerald-300/80 shrink-0">
              &bull; Role-Based Access Control
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] shrink-0">
            <span className="bg-emerald-900/90 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">
              {role || 'PayrollOfficer'}
            </span>

            <button
              onClick={onExitToPublic}
              className="hidden sm:inline text-emerald-200 hover:text-white underline font-medium whitespace-nowrap"
            >
              Public Portal &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Area */}
      <div className="flex-1 min-h-0 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-stone-200 shadow-sm">
          {/* Identity Header */}
          <div className="p-5 border-b border-stone-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-[#008C45] text-white flex items-center justify-center font-black text-base shadow-inner">
                ICOH
              </div>

              <div className="overflow-hidden min-w-0">
                <h2 className="text-xs font-bold text-stone-900 uppercase tracking-tight truncate">
                  Payroll Desk Console
                </h2>

                <p className="text-[11px] text-stone-500 truncate">
                  {adminProfile?.fullName || 'Authorized Officer'}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="p-3 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#008C45] text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-stone-500'
                    }`}
                  />

                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Officer Status */}
          <div className="p-4 border-t border-stone-200 bg-stone-50">
            <div className="text-[11px] text-stone-500 space-y-0.5 mb-3">
              <div className="font-bold text-stone-800 truncate">
                {adminProfile?.email}
              </div>

              <div className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008C45]" />
                <span>Active Session</span>
              </div>
            </div>

            <button
              id="admin-logout-sidebar-btn"
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded border border-stone-300 text-stone-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Console</span>
            </button>
          </div>
        </aside>

        {/* Right Side: Mobile Header + Main Content */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden shrink-0 bg-white border-b border-stone-200 px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  id="admin-mobile-menu-btn"
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  className="shrink-0 p-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
                  aria-label="Open admin navigation"
                >
                  {mobileNavOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-900 truncate">
                    Admin Console
                  </div>

                  <div className="text-[10px] text-stone-500 truncate">
                    {navItems.find((item) => item.id === currentTab)?.label}
                  </div>
                </div>
              </div>

              <button
                id="admin-mobile-logout-btn"
                onClick={handleLogout}
                className="shrink-0 text-xs text-red-600 font-semibold px-2 py-1.5 rounded hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileNavOpen && (
              <div className="mt-3 bg-stone-50 border border-stone-200 rounded-xl p-2 space-y-1 shadow-sm">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMobileNavigation(item.id)}
                      className={`w-full flex items-center gap-3 text-left px-3 py-3 rounded-lg text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#008C45] text-white'
                          : 'text-stone-700 hover:bg-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={onExitToPublic}
                  className="w-full text-left px-3 py-3 rounded-lg text-xs font-semibold text-stone-600 hover:bg-white border-t border-stone-200 mt-1"
                >
                  &larr; Return to Public Portal
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            <div className="w-full max-w-7xl mx-auto p-3 sm:p-5 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};