import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Navbar from "components/ui/Navbar";
// Add your imports here
import MetaMaskAuthenticationRegistration from "pages/meta-mask-authentication-registration";
import CitizenZKPAuthentication from "pages/citizen-zkp-authentication";
import CitizenAuthentication from "pages/citizen-authentication";
import AdminAuthenticationPortal from "pages/admin-authentication-portal";
import NationalPublicLeaderboard from "pages/national-public-leaderboard";
import CitizenDashboardGrievanceFiling from "pages/citizen-dashboard-grievance-filing";
import StateSpecificPerformanceDashboard from "pages/state-specific-performance-dashboard";
import ComprehensiveAdminDashboard from "pages/comprehensive-admin-dashboard";
import NotFound from "pages/NotFound";
import CitizenAccount from 'pages/citizen-account';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <Navbar />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<NationalPublicLeaderboard />} />
        <Route path="/auth" element={<CitizenAuthentication />} />
        <Route path="/citizen-auth" element={<CitizenZKPAuthentication />} />
        <Route path="/meta-mask-authentication-registration" element={<MetaMaskAuthenticationRegistration />} />
        <Route path="/admin-authentication-portal" element={<AdminAuthenticationPortal />} />
        <Route path="/national-public-leaderboard" element={<NationalPublicLeaderboard />} />
        <Route path="/citizen-dashboard-grievance-filing" element={<CitizenDashboardGrievanceFiling />} />
        <Route path="/state-specific-performance-dashboard" element={<StateSpecificPerformanceDashboard />} />
        <Route path="/comprehensive-admin-dashboard" element={<ComprehensiveAdminDashboard />} />
        <Route path="/citizen-account" element={<CitizenAccount />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;