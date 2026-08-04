import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { OceanAnalyticsPage } from '../pages/OceanAnalyticsPage';
import { FisheriesPage } from '../pages/FisheriesPage';
import { BiodiversityPage } from '../pages/BiodiversityPage';
import { AIInsightsPage } from '../pages/AIInsightsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProtectedRoute } from '../components/routes/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-ocean-950 text-slate-100">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ocean" 
            element={
              <ProtectedRoute>
                <OceanAnalyticsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fisheries" 
            element={
              <ProtectedRoute>
                <FisheriesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/biodiversity" 
            element={
              <ProtectedRoute>
                <BiodiversityPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/insights" 
            element={
              <ProtectedRoute>
                <AIInsightsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
