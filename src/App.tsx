import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { RequestForm } from './pages/RequestForm';
import { RequestConfirmation } from './pages/RequestConfirmation';
import { HelpPage } from './pages/HelpPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { RequestList } from './pages/RequestList';
import { RequestDetails } from './pages/RequestDetails';
import { AdminProfile } from './pages/AdminProfile';
import { AuditLogs } from './pages/AuditLogs';
import { AdminManagement } from './pages/AdminManagement';
import { SystemSettingsPage } from './pages/SystemSettings';
import { PayslipRequest } from './types';
import { fetchAllRequests } from './services/requestService';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { currentUser, loading: authLoading } = useAuth();

  // Public portal views:
  // 'home' | 'request' | 'confirmation' | 'help' | 'login' | 'admin'
  const [currentView, setCurrentView] = useState<string>('home');

  // Confirmation state
  const [lastReferenceNumber, setLastReferenceNumber] = useState<string>('');
  const [lastRequestData, setLastRequestData] = useState<any>(null);

  // Admin section state
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [selectedRequest, setSelectedRequest] =
    useState<PayslipRequest | null>(null);

  // Shared admin requests cache
  const [requests, setRequests] = useState<PayslipRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(false);

  const loadRequestsData = async () => {
    if (!currentUser) return;

    setLoadingRequests(true);

    try {
      const data = await fetchAllRequests();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching admin requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentView === 'admin') {
      loadRequestsData();
    }
  }, [currentUser, currentView]);

  // Handle successful employee submission
  const handleSubmissionSuccess = (
    referenceNumber: string,
    requestData: any
  ) => {
    setLastReferenceNumber(referenceNumber);
    setLastRequestData(requestData);
    setCurrentView('confirmation');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle navigation between public portal and admin console
  const handleNavigate = (view: string) => {
    if (view === 'admin' && !currentUser) {
      setCurrentView('login');
    } else {
      setCurrentView(view);
    }

    setSelectedRequest(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Wait for Firebase authentication to finish initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#008C45] animate-spin mx-auto" />

          <p className="text-xs font-semibold text-stone-600">
            Initializing ICOH Portal Services...
          </p>
        </div>
      </div>
    );
  }

  // Render Admin Console Interface
  if (currentView === 'admin' && currentUser) {
    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={(tab) => {
          setAdminTab(tab);
          setSelectedRequest(null);
        }}
        onExitToPublic={() => handleNavigate('home')}
      >
        {selectedRequest ? (
          <RequestDetails
            request={selectedRequest}
            onBack={() => setSelectedRequest(null)}
            onUpdated={(updated) => {
              setSelectedRequest(updated);

              setRequests((prev) =>
                prev.map((r) =>
                  r.id === updated.id ? updated : r
                )
              );
            }}
          />
        ) : (
          <>
            {adminTab === 'dashboard' && (
              <AdminDashboard
                requests={requests}
                loading={loadingRequests}
                onRefresh={loadRequestsData}
                onSelectRequest={(req) => setSelectedRequest(req)}
                onViewAllRequests={() => setAdminTab('requests')}
              />
            )}

            {adminTab === 'requests' && (
              <RequestList
                requests={requests}
                onSelectRequest={(req) => setSelectedRequest(req)}
                onRefresh={loadRequestsData}
              />
            )}

            {adminTab === 'profile' && <AdminProfile />}

            {adminTab === 'audit' && <AuditLogs />}

            {adminTab === 'admins' && <AdminManagement />}

            {adminTab === 'settings' && <SystemSettingsPage />}
          </>
        )}
      </AdminLayout>
    );
  }

  // Render Public Portal Interface
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">

      {/* Public Navigation */}
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Public Body Content */}
      <main className="flex-1">

        {/* Home Page */}
        {currentView === 'home' && (
          <HomePage
            onStartRequest={() => handleNavigate('request')}
            onViewHelp={() => handleNavigate('help')}
            onAdminLogin={() => handleNavigate('login')}
          />
        )}

        {/* Employee Request Form */}
        {currentView === 'request' && (
          <RequestForm
            onSuccess={handleSubmissionSuccess}
            onCancel={() => handleNavigate('home')}
          />
        )}

        {/* Request Confirmation */}
        {currentView === 'confirmation' && (
          <RequestConfirmation
            referenceNumber={lastReferenceNumber}
            requestData={lastRequestData}
            onSubmitAnother={() => handleNavigate('request')}
            onReturnHome={() => handleNavigate('home')}
          />
        )}

        {/* Help Page */}
        {currentView === 'help' && (
          <HelpPage
            onStartRequest={() => handleNavigate('request')}
          />
        )}

        {/* Admin Login */}
        {currentView === 'login' && (
          <AdminLoginPage
            onSuccess={() => {
              // Go directly to the admin console after successful login.
              setCurrentView('admin');
              setAdminTab('dashboard');
              setSelectedRequest(null);

              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
            onReturnHome={() => handleNavigate('home')}
          />
        )}

      </main>

      {/* Public Footer */}
      <Footer
        onAdminClick={() =>
          handleNavigate(currentUser ? 'admin' : 'login')
        }
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}