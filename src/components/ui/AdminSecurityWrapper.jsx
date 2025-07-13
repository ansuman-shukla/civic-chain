import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AdminSecurityWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    checkAuthentication();
    startSessionTimer();
    
    return () => {
      if (window.sessionTimer) {
        clearInterval(window.sessionTimer);
      }
    };
  }, []);

  const checkAuthentication = () => {
    const adminSession = localStorage.getItem('adminSession');
    const adminExpiry = localStorage.getItem('adminSessionExpiry');
    const adminData = localStorage.getItem('adminUserData');
    
    if (adminSession && adminExpiry && adminData) {
      const now = new Date().getTime();
      const expiryTime = parseInt(adminExpiry);
      
      if (now < expiryTime) {
        setIsAuthenticated(true);
        setAdminUser(JSON.parse(adminData));
        setSessionTimeLeft(Math.floor((expiryTime - now) / 1000));
      } else {
        handleLogout();
      }
    } else {
      redirectToLogin();
    }
  };

  const startSessionTimer = () => {
    window.sessionTimer = setInterval(() => {
      const adminExpiry = localStorage.getItem('adminSessionExpiry');
      if (adminExpiry) {
        const now = new Date().getTime();
        const expiryTime = parseInt(adminExpiry);
        const timeLeft = Math.floor((expiryTime - now) / 1000);
        
        setSessionTimeLeft(timeLeft);
        
        // Show warning when 5 minutes left
        if (timeLeft <= 300 && timeLeft > 0) {
          setShowSessionWarning(true);
        }
        
        // Auto logout when session expires
        if (timeLeft <= 0) {
          handleLogout();
        }
      }
    }, 1000);
  };

  const extendSession = () => {
    const newExpiry = new Date().getTime() + (30 * 60 * 1000); // 30 minutes
    localStorage.setItem('adminSessionExpiry', newExpiry.toString());
    setShowSessionWarning(false);
    setSessionTimeLeft(30 * 60);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminSessionExpiry');
    localStorage.removeItem('adminUserData');
    
    if (window.sessionTimer) {
      clearInterval(window.sessionTimer);
    }
    
    // Log audit trail
    console.log('Admin session ended:', {
      timestamp: new Date().toISOString(),
      user: adminUser?.email || 'unknown',
      reason: sessionTimeLeft <= 0 ? 'timeout' : 'manual_logout'
    });
    
    window.location.href = '/admin-authentication-portal';
  };

  const redirectToLogin = () => {
    if (location.pathname !== '/admin-authentication-portal') {
      window.location.href = '/admin-authentication-portal';
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  if (!isAuthenticated && location.pathname !== '/admin-authentication-portal') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      {isAuthenticated && (
        <header className="bg-card border-b border-border lg:fixed top-0 left-0 right-0 z-50 shadow-government">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                    <Icon name="Shield" size={20} color="white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-heading font-semibold text-foreground">CivicChain Admin</span>
                    <span className="text-xs font-caption text-muted-foreground hidden sm:block">Government Administration Portal</span>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="/comprehensive-admin-dashboard"
                  className={`font-body font-medium transition-government ${
                    isActiveRoute('/comprehensive-admin-dashboard')
                      ? 'text-primary border-b-2 border-primary pb-1' :'text-foreground hover:text-primary'
                  }`}
                >
                  Dashboard
                </a>
                <a
                  href="/comprehensive-admin-dashboard"
                  className="text-foreground hover:text-primary transition-government font-body font-medium"
                >
                  Grievance Management
                </a>
                <a
                  href="/national-public-leaderboard"
                  className="text-muted-foreground hover:text-primary transition-government font-body font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Public View
                </a>
              </nav>

              {/* Admin Info & Actions */}
              <div className="flex items-center space-x-4">
                {/* Session Timer */}
                <div className="hidden lg:flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="font-mono text-sm text-foreground">{formatTime(sessionTimeLeft)}</span>
                </div>

                {/* Admin User Info */}
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-body font-medium text-foreground">{adminUser?.name || 'Admin'}</span>
                    <span className="text-xs font-caption text-muted-foreground">{adminUser?.department || 'Government'}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  iconName="LogOut"
                  iconPosition="left"
                  iconSize={16}
                  className="hidden sm:flex"
                >
                  Logout
                </Button>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileMenu}
                  className="md:hidden"
                >
                  <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-border bg-card">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <a
                    href="/comprehensive-admin-dashboard"
                    className={`block px-3 py-2 rounded-md transition-government font-body font-medium ${
                      isActiveRoute('/comprehensive-admin-dashboard')
                        ? 'text-primary bg-muted' :'text-foreground hover:text-primary hover:bg-muted'
                    }`}
                  >
                    Dashboard
                  </a>
                  <a
                    href="/comprehensive-admin-dashboard"
                    className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-government font-body font-medium"
                  >
                    Grievance Management
                  </a>
                  <a
                    href="/national-public-leaderboard"
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-government font-body font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Public View
                  </a>

                  {/* Mobile Admin Info */}
                  <div className="px-3 py-2 border-t border-border mt-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <Icon name="User" size={20} color="white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-body font-medium text-foreground">{adminUser?.name || 'Admin'}</span>
                        <span className="text-xs font-caption text-muted-foreground">{adminUser?.department || 'Government'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-caption text-muted-foreground">Session Time:</span>
                      <span className="font-mono text-sm text-foreground">{formatTime(sessionTimeLeft)}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      iconName="LogOut"
                      iconPosition="left"
                      iconSize={16}
                      fullWidth
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Session Warning Modal */}
      {showSessionWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-government-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground">Session Expiring Soon</h3>
                <p className="text-sm font-body text-muted-foreground">Your session will expire in {formatTime(sessionTimeLeft)}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="default"
                onClick={extendSession}
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={16}
                className="flex-1"
              >
                Extend Session
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                iconName="LogOut"
                iconPosition="left"
                iconSize={16}
                className="flex-1"
              >
                Logout Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={isAuthenticated ? 'lg:pt-16' : ''}>
        {children}
      </main>
    </div>
  );
};

export default AdminSecurityWrapper;