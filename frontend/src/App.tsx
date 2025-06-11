import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CandidatesPage } from './pages/candidates/CandidatesPage';
import { NewCandidatePage } from './pages/candidates/NewCandidatePage';
import { CandidateDetailPage } from './pages/candidates/CandidateDetailPage';
import { JobOffersPage } from './pages/offers/JobOffersPage';
import { NewJobOfferPage } from './pages/offers/NewJobOfferPage';
import { JobOfferDetailPage } from './pages/offers/JobOfferDetailPage';
import { ApplicationsPage } from './pages/applications/ApplicationsPage';
import { NewApplicationPage } from './pages/applications/NewApplicationPage';
import { FilesPage } from './pages/files/FilesPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { useAuthStore } from './store/authStore';

// 🔐 Route privée avec authentification
const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

// 🔒 Route réservée aux administrateurs
const AdminRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return user?.role === 'admin' ? <>{element}</> : <Navigate to="/dashboard" />;
};

const App: React.FC = () => {
  useEffect(() => {
    console.log('✅ API_URL =', import.meta.env.VITE_API_URL);
  }, []);

  return (
    <Router>
      <Routes>
        {/* 🔓 Routes publiques */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🔐 Routes protégées avec layout */}
        <Route path="/" element={<PrivateRoute element={<DashboardLayout />} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="candidates/new" element={<NewCandidatePage />} />
          <Route path="candidates/:id" element={<CandidateDetailPage />} />

          <Route path="offers" element={<JobOffersPage />} />
          <Route path="offers/new" element={<NewJobOfferPage />} />
          <Route path="offers/:id" element={<JobOfferDetailPage />} />

          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="applications/new" element={<NewApplicationPage />} />

          <Route path="files" element={<FilesPage />} />

          {/* 🔒 Route réservée aux admins */}
          <Route path="settings" element={<AdminRoute element={<SettingsPage />} />} />
        </Route>

        {/* ❓ Route fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
