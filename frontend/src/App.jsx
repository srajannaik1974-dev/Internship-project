import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import MobileDrawer from './components/MobileDrawer';
import MobileNav from './components/MobileNav';
import Dashboard from './pages/Dashboard';
import AnalyzeFood from './pages/AnalyzeFood';
import FoodDiaryPage from './pages/FoodDiaryPage';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import { getProfile, getStoredUser, getCurrentUser } from './services/api';

// Public routes: no sidebar or app shell
const PUBLIC_ROUTES = ['/', '/signin'];

const AppShell = ({ userName }) => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer whenever route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      {/* ── Desktop sidebar (hidden via CSS on mobile) ── */}
      <Sidebar userName={userName} />

      {/* ── Mobile-only: sticky top header ── */}
      <MobileHeader
        userName={userName}
        onMenuOpen={() => setDrawerOpen(true)}
      />

      {/* ── Mobile-only: slide-in navigation drawer ── */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userName={userName}
      />

      {/* ── Main page content ── */}
      <div className="main-wrapper">
        <main className="page-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze" element={<AnalyzeFood />} />
            <Route path="/diary" element={<FoodDiaryPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <MobileNav />
    </div>
  );
};

function App() {
  const storedUser = getStoredUser();
  const [userName, setUserName] = useState(storedUser?.name || 'User');

  useEffect(() => {
    // 1. Try getCurrentUser from auth endpoint
    getCurrentUser()
      .then(res => {
        if (res?.data?.name) {
          setUserName(res.data.name);
        }
      })
      .catch(() => {
        // 2. Fallback to profile
        getProfile()
          .then(res => {
            const name = res?.data?.name || res?.name;
            if (name) setUserName(name);
          })
          .catch(() => {});
      });
  }, []);

  return (
    <BrowserRouter>
      <AppShell userName={userName} />
    </BrowserRouter>
  );
}

export default App;
