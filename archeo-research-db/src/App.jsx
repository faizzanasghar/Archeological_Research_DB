import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { Toaster } from 'react-hot-toast';

import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import NavigationBar from './components/NavigationBar';
import Dashboard from './pages/Dashboard';
import SitesExplorer from './pages/SitesExplorer';
import ArtifactRegistry from './pages/ArtifactRegistry';
import DatingCenter from './pages/DatingCenter';
import Researchers from './pages/Researchers';
import Financials from './pages/Financials';
import Users from './pages/Users';
import Attendance from './pages/Attendance';
import Inventory from './pages/Inventory';
import Laboratory from './pages/Laboratory';
import Infrastructure from './pages/Infrastructure';
import AuditLogs from './pages/AuditLogs';
import AboutData from './pages/AboutData';
import Owner from './pages/Owner';

function AuthenticatedLayout() {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen bg-app-bg">
      <NavigationBar />
      <main className="flex-1 lg:ml-72 transition-all duration-300 min-h-screen">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sites" element={<SitesExplorer />} />
            <Route path="/artifacts" element={<ArtifactRegistry />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/lab" element={<Laboratory />} />
            <Route path="/researchers" element={<Researchers />} />
            <Route path="/dating" element={<DatingCenter />} />
            <Route path="/financials" element={
              <ProtectedRoute allowedRoles={['SuperAdmin', 'DBA', 'LeadDirector', 'FieldLabourAdmin']}>
                <Financials />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['SuperAdmin', 'DBA']}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/infrastructure" element={
              <ProtectedRoute allowedRoles={['SuperAdmin', 'DBA']}>
                <Infrastructure />
              </ProtectedRoute>
            } />
            <Route path="/audit" element={
              <ProtectedRoute allowedRoles={['SuperAdmin', 'DBA']}>
                <AuditLogs />
              </ProtectedRoute>
            } />
            <Route path="/about" element={<AboutData />} />
            <Route path="/owner" element={<Owner />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
    if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.add('light');
    }
  }, [initAuth]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        className: 'bg-app-surface border border-app-border text-app-text',
        style: {
          background: '#141f2e',
          color: '#e8e0d0',
          border: '1px solid rgba(212, 169, 67, 0.22)'
        }
      }} />
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <AuthenticatedLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </>
  );
}
