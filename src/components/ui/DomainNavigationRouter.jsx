import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DomainNavigationRouter = ({ children }) => {
  const [userDomain, setUserDomain] = useState('public');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuthenticationState();
    determineDomainFromRoute();
  }, [location.pathname]);

  const checkAuthenticationState = async () => {
    // Check wallet connection
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setIsWalletConnected(accounts.length > 0);
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        setIsWalletConnected(false);
      }
    }

    // Check admin authentication from localStorage
    const adminSession = localStorage.getItem('adminSession');
    const adminExpiry = localStorage.getItem('adminSessionExpiry');
    
    if (adminSession && adminExpiry) {
      const now = new Date().getTime();
      const expiryTime = parseInt(adminExpiry);
      
      if (now < expiryTime) {
        setIsAdminAuthenticated(true);
      } else {
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminSessionExpiry');
        setIsAdminAuthenticated(false);
      }
    }
  };

  const determineDomainFromRoute = () => {
    const path = location.pathname;
    
    // Admin domain routes
    if (path.includes('/admin-authentication-portal') || path.includes('/comprehensive-admin-dashboard')) {
      setUserDomain('admin');
      return;
    }
    
    // Citizen domain routes
    if (path.includes('/meta-mask-authentication-registration') || path.includes('/citizen-dashboard-grievance-filing')) {
      setUserDomain('citizen');
      return;
    }
    
    // Public domain routes (default)
    if (path.includes('/national-public-leaderboard') || path.includes('/state-specific-performance-dashboard')) {
      setUserDomain('public');
      return;
    }
    
    // Default to public domain
    setUserDomain('public');
  };

  const getDomainContext = () => {
    return {
      domain: userDomain,
      isWalletConnected,
      isAdminAuthenticated,
      canAccessCitizen: isWalletConnected,
      canAccessAdmin: isAdminAuthenticated,
      canAccessPublic: true,
    };
  };

  const handleDomainSwitch = (targetDomain) => {
    switch (targetDomain) {
      case 'citizen':
        if (!isWalletConnected) {
          window.location.href = '/meta-mask-authentication-registration';
        } else {
          window.location.href = '/citizen-dashboard-grievance-filing';
        }
        break;
      case 'admin':
        if (!isAdminAuthenticated) {
          window.location.href = '/admin-authentication-portal';
        } else {
          window.location.href = '/comprehensive-admin-dashboard';
        }
        break;
      case 'public':
        window.location.href = '/national-public-leaderboard';
        break;
      default:
        window.location.href = '/national-public-leaderboard';
    }
  };

  const handleLogout = (domain) => {
    switch (domain) {
      case 'citizen':
        setIsWalletConnected(false);
        window.location.href = '/national-public-leaderboard';
        break;
      case 'admin': localStorage.removeItem('adminSession');
        localStorage.removeItem('adminSessionExpiry');
        setIsAdminAuthenticated(false);
        window.location.href = '/national-public-leaderboard';
        break;
      default:
        window.location.href = '/national-public-leaderboard';
    }
  };

  // Provide context to child components
  const contextValue = {
    ...getDomainContext(),
    switchDomain: handleDomainSwitch,
    logout: handleLogout,
  };

  return (
    <div className="min-h-screen bg-background">
      {React.cloneElement(children, { domainContext: contextValue })}
    </div>
  );
};

export default DomainNavigationRouter;