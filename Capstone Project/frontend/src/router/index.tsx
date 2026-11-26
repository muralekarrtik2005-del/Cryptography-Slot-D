import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

// Pages
import { Landing } from '../pages/Landing';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { DataAnalysis } from '../pages/DataAnalysis';
import { AIRecommendations } from '../pages/AIRecommendations';
import { Cryptanalysis } from '../pages/Cryptanalysis';
import { Encryption } from '../pages/Encryption';
import { Reports } from '../pages/Reports';
import { SecurityDashboard } from '../pages/SecurityDashboard';
import { History } from '../pages/History';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected SOC Dashboard Shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
          <Route path="/ai-recommendations" element={<AIRecommendations />} />
          <Route path="/cryptanalysis" element={<Cryptanalysis />} />
          <Route path="/encryption" element={<Encryption />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/security-dashboard" element={<SecurityDashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
