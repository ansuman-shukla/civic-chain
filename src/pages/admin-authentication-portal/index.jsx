import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SecurityIndicators from './components/SecurityIndicators';
import TrustBadges from './components/TrustBadges';
import LoginForm from './components/LoginForm';
import SystemStatus from './components/SystemStatus';
import QuickAccessLinks from './components/QuickAccessLinks';
import Icon from '../../components/AppIcon';

const AdminAuthenticationPortal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already authenticated
    const adminSession = localStorage.getItem('adminSession');
    const adminExpiry = localStorage.getItem('adminSessionExpiry');
    
    if (adminSession && adminExpiry) {
      const now = new Date().getTime();
      const expiryTime = parseInt(adminExpiry);
      
      if (now < expiryTime) {
        navigate('/comprehensive-admin-dashboard');
      } else {
        // Clean up expired session
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminSessionExpiry');
        localStorage.removeItem('adminUserData');
      }
    }

    // Set page title
    document.title = 'Admin Portal - CivicChain | Government Authentication';
  }, [navigate]);

  const handleLogin = async (adminData, rememberMe) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create session
      const sessionDuration = rememberMe ? 24 * 60 * 60 * 1000 : 30 * 60 * 1000; // 24 hours or 30 minutes
      const expiryTime = new Date().getTime() + sessionDuration;
      
      localStorage.setItem('adminSession', 'authenticated');
      localStorage.setItem('adminSessionExpiry', expiryTime.toString());
      localStorage.setItem('adminUserData', JSON.stringify(adminData));

      // Log successful authentication
      console.log('Admin authentication successful:', {
        timestamp: new Date().toISOString(),
        user: adminData.email,
        sessionDuration: rememberMe ? '24h' : '30m'
      });

      // Redirect to admin dashboard
      navigate('/comprehensive-admin-dashboard');
    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">
                  CivicChain Administration
                </h1>
                <p className="text-sm font-caption text-muted-foreground">
                  Secure Government Portal
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm font-caption text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>{new Date().toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}</span>
              </div>
              <a 
                href="/national-public-leaderboard"
                className="text-sm font-body text-primary hover:text-primary/80 transition-government"
              >
                Public Portal
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Authentication Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Security Indicators */}
            <SecurityIndicators />
            
            {/* Login Form */}
            <LoginForm 
              onLogin={handleLogin}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* Right Column - Additional Information */}
          <div className="space-y-8">
            {/* Trust Badges */}
            <TrustBadges />
            
            {/* System Status */}
            <SystemStatus />
            
            {/* Quick Access Links */}
            <QuickAccessLinks />
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
                Security Notice
              </h3>
              <p className="text-xs font-body text-muted-foreground leading-relaxed">
                This is a secure government portal. All access attempts are logged and monitored. 
                Unauthorized access is strictly prohibited and may result in legal action.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
                Technical Support
              </h3>
              <div className="space-y-2 text-xs font-caption text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={12} />
                  <span>support@civicchain.gov.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={12} />
                  <span>1800-XXX-XXXX (24/7)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={12} />
                  <span>Emergency: +91-XXXX-XXXXXX</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
                System Information
              </h3>
              <div className="space-y-2 text-xs font-caption text-muted-foreground">
                <div>Version: 2.1.0</div>
                <div>Last Updated: December 2024</div>
                <div>Environment: Production</div>
                <div>Region: India (IST)</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-border text-center">
            <p className="text-xs font-caption text-muted-foreground">
              © {new Date().getFullYear()} Government of India. All rights reserved. | 
              <a href="#" className="text-primary hover:text-primary/80 transition-government ml-1">
                Privacy Policy
              </a> | 
              <a href="#" className="text-primary hover:text-primary/80 transition-government ml-1">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAuthenticationPortal;