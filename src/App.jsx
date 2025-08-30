import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Login from './components/auth/Login';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import PropertiesPage from './components/OtherPages/Properties';
import AgentsPage from './components/OtherPages/AgentList';
import AboutPage from './components/OtherPages/About';
import ContactPage from './components/OtherPages/Contact';
import Reviews from './components/OtherPages/Reviews';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import RegistrationForm from './components/auth/RegistrationForm';

function AppContent() {
  const { user, token, logout } = useAuth();

  return (
    <div className="App">
      <main>
        <Routes>
          {/* Public Pages */}
          <Route
            path="/"
            element={<LandingPage token={token} user={user} onLogout={logout} />}
          />
          <Route
            path="/properties"
            element={<PropertiesPage token={token} user={user} onLogout={logout} />}
          />
          <Route
            path="/agents"
            element={<AgentsPage token={token} user={user} onLogout={logout} />}
          />
          <Route
            path="/reviews"
            element={<Reviews token={token} user={user} onLogout={logout} />}
          />
          <Route
            path="/about"
            element={<AboutPage token={token} user={user} onLogout={logout} />}
          />
          <Route
            path="/contact"
            element={<ContactPage token={token} user={user} onLogout={logout} />}
          />

          {/* Auth Pages */}
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<RegistrationForm />}
          />

          {/* Protected Pages */}
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="/admin/*"
            element={<AdminDashboard />}
          />
          <Route
            path="/agent/*"
            element={<AgentDashboard />}
          />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
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
