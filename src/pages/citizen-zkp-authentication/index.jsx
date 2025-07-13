import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import AadhaarZKPAuth from '../../components/auth/AadhaarZKPAuth';
import TrustIndicators from '../meta-mask-authentication-registration/components/TrustIndicators';
import LanguageSelector from '../meta-mask-authentication-registration/components/LanguageSelector';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CitizenZKPAuthentication = () => {
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Generate a unique nullifier seed for your application
  const NULLIFIER_SEED = 123456789; // In production, generate this securely

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.verified && userData.aadhaarVerified) {
        // Auto-redirect verified users
        setTimeout(() => {
          navigate('/citizen-dashboard-grievance-filing');
        }, 2000);
      }
    }

    // Set page title
    document.title = 'Citizen Authentication - CivicChain | Aadhaar Verification';
  }, [navigate]);

  const handleAuthSuccess = (userProfile) => {
    setAuthError('');
    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      navigate('/citizen-dashboard-grievance-filing');
    }, 1500);
  };

  const handleAuthError = (error) => {
    setAuthError(error);
  };

  const handleViewPublicData = () => {
    navigate('/national-public-leaderboard');
  };

  const handleAdminAccess = () => {
    navigate('/admin-authentication-portal');
  };

  return (
    <AnonAadhaarProvider _useTestAadhaar={true}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border shadow-government">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={24} color="white" />
                </div>
                <div>
                  <h1 className="text-xl font-heading font-semibold text-foreground">CivicChain</h1>
                  <p className="text-sm text-muted-foreground font-caption">Secure Citizen Portal</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewPublicData}
                  iconName="BarChart3"
                  iconPosition="left"
                  iconSize={16}
                >
                  Public Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAdminAccess}
                  iconName="Settings"
                  iconPosition="left"
                  iconSize={16}
                >
                  Admin
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Language Selector & Branding */}
            <div className="space-y-8">
              <LanguageSelector />
              <TrustIndicators />
            </div>

            {/* Right Column - ZKP Authentication */}
            <div className="flex flex-col items-center justify-start space-y-6">
              {/* Connection Error */}
              {authError && (
                <div className="w-full max-w-md bg-error bg-opacity-10 border border-error text-error p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={20} />
                    <div>
                      <h3 className="font-body font-medium">Authentication Error</h3>
                      <p className="text-sm font-caption">{authError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Aadhaar ZKP Authentication */}
              <AadhaarZKPAuth
                onAuthSuccess={handleAuthSuccess}
                onAuthError={handleAuthError}
                nullifierSeed={NULLIFIER_SEED}
              />

              {/* Information Section */}
              <div className="w-full max-w-md space-y-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-body font-medium text-foreground mb-2 flex items-center">
                    <Icon name="Info" size={16} className="mr-2 text-primary" />
                    What is Zero-Knowledge Proof?
                  </h3>
                  <div className="space-y-2 text-xs text-muted-foreground font-caption">
                    <p>• Proves your Aadhaar identity without revealing your Aadhaar number</p>
                    <p>• Uses advanced cryptography to ensure complete privacy</p>
                    <p>• Prevents spam and fake grievances</p>
                    <p>• Maintains anonymity while ensuring authenticity</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-sm font-body font-medium text-foreground mb-2 flex items-center">
                    <Icon name="HelpCircle" size={16} className="mr-2 text-primary" />
                    Need Help?
                  </h3>
                  <div className="space-y-2 text-xs text-muted-foreground font-caption">
                    <p>• Upload your Aadhaar PDF file when prompted</p>
                    <p>• Ensure your Aadhaar document is valid and readable</p>
                    <p>• The verification process may take a few minutes</p>
                    <p>• Your data remains completely private and secure</p>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => window.open('https://anon-aadhaar.pse.dev/', '_blank')}
                    iconName="ExternalLink"
                    iconPosition="right"
                    iconSize={14}
                  >
                    Learn More About Anon Aadhaar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                Enhanced Security Features
              </h2>
              <p className="text-muted-foreground font-body max-w-2xl mx-auto">
                CivicChain uses cutting-edge Zero-Knowledge Proof technology to ensure the highest levels 
                of privacy and security for citizen identity verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={32} color="white" />
                </div>
                <h3 className="text-lg font-heading font-medium text-foreground mb-2">
                  Zero-Knowledge Privacy
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  Prove your identity without revealing any personal information. 
                  Your Aadhaar number stays completely private.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} color="white" />
                </div>
                <h3 className="text-lg font-heading font-medium text-foreground mb-2">
                  Spam Prevention
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  Verified identity ensures only authentic citizens can file grievances, 
                  eliminating fake or spam complaints.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Database" size={32} color="white" />
                </div>
                <h3 className="text-lg font-heading font-medium text-foreground mb-2">
                  Blockchain Security
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  All verification proofs are stored on blockchain for immutable 
                  records and transparent governance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Shield" size={16} color="white" />
                  </div>
                  <span className="font-heading font-semibold text-foreground">CivicChain</span>
                </div>
                <p className="text-sm text-muted-foreground font-body">
                  Empowering citizens through secure, privacy-preserving governance technology.
                </p>
              </div>
              
              <div>
                <h3 className="font-body font-medium text-foreground mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <a href="/national-public-leaderboard" className="block text-sm text-muted-foreground hover:text-primary transition-government font-caption">
                    Public Leaderboard
                  </a>
                  <a href="/state-specific-performance-dashboard" className="block text-sm text-muted-foreground hover:text-primary transition-government font-caption">
                    State Performance
                  </a>
                  <a href="/admin-authentication-portal" className="block text-sm text-muted-foreground hover:text-primary transition-government font-caption">
                    Admin Portal
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-body font-medium text-foreground mb-3">Support</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-caption">Help: 1800-XXX-XXXX</p>
                  <p className="text-sm text-muted-foreground font-caption">Email: support@civicchain.gov.in</p>
                  <p className="text-sm text-muted-foreground font-caption">Available 24/7</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 mt-6 text-center">
              <p className="text-sm text-muted-foreground font-caption">
                © {new Date().getFullYear()} CivicChain. Government of India. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AnonAadhaarProvider>
  );
};

export default CitizenZKPAuthentication;
