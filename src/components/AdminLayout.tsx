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
  X,
  FileText
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
  children,
}) => {
  const { adminProfile, role, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isSuperAdmin = role === 'SuperAdmin';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'requests', label: 'All Requests Queue', icon: ListFilter },
    { id: 'profile', label: 'My Admin Profile', icon: UserCheck },
    ...(isSuperAdmin ? [
      { id: 'audit', label: 'Audit Logs', icon: ShieldAlert },
      { id: 'admins', label: 'Admin Officers', icon: Building2 },
      { id: 'settings', label: 'System Settings', icon: Settings },
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      
      {/* Top Federal Bar for Admin */}
      <div className="bg-[#005a2b] text-emerald-100 text-xs py-1.5 px-4 sm:px-6 flex items-center justify-between border-b border-emerald-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold tracking-wide">ICOH SECURE ADMINISTRATIVE CONSOLE</span>
          <span className="hidden sm:inline text-emerald-300/80">&bull; Role-Based Access Control</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="bg-emerald-900/90 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">
            {role || 'PayrollOfficer'}
          </span>
          <button
            onClick={onExitToPublic}
            className="text-emerald-200 hover:text-white underline font-medium"
          >
            Public Portal &rarr;
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200 shadow-sm">
          
          {/* Identity Header */}
          <div className="p-5 border-b border-stone-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#008C45] text-white flex items-center justify-center font-black text-base shadow-inner">
                ICOH
              </div>
              <div className="overflow-hidden">
                <h2 className="text-xs font-bold text-stone-900 uppercase tracking-tight truncate">
                  Payroll Desk Console
                </h2>
                <p className="text-[11px] text-stone-500 truncate">
                  {adminProfile?.fullName || 'Authorized Officer'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
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
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Officer Status Card */}
          <div className="p-4 border-t border-stone-200 bg-stone-50">
            <div className="text-[11px] text-stone-500 space-y-0.5 mb-3">
              <div className="font-bold text-stone-800 truncate">
                {adminProfile?.email}
              </div>
              <div className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008C45]"></span>
                <span>Active Session</span>
              </div>
            </div>

            <button
              id="admin-logout-sidebar-btn"
              onClick={async () => {
                await logout();
                onExitToPublic();
              }}
              className="w-full py-2 px-3 rounded border border-stone-300 text-stone-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Console</span>
            </button>
          </div>

        </aside>

        {/* Mobile Header / Toggle */}
        <div className="lg:hidden w-full bg-white border-b border-stone-200 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-1.5 rounded border border-stone-300 text-stone-700"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs font-bold text-stone-900">
              Admin Console ({navItems.find(i => i.id === currentTab)?.label})
            </span>
          </div>

          <button
            onClick={async () => {
              await logout();
              onExitToPublic();
            }}
            className="text-xs text-red-600 font-semibold"
          >
            Sign Out
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {mobileNavOpen && (
            <div className="lg:hidden mb-6 bg-white p-3 rounded-lg border border-stone-200 space-y-1 shadow-md">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-semibold ${
                    currentTab === item.id
                      ? 'bg-[#008C45] text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {children}
        </main>

      </div>
    </div>
  );
};
