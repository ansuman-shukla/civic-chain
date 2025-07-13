import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletConnectionCard from './components/WalletConnectionCard';
import UserRegistrationForm from './components/UserRegistrationForm';
import TrustIndicators from './components/TrustIndicators';
import LanguageSelector from './components/LanguageSelector';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MetaMaskAuthenticationRegistration = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already connected and registered
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          
          // Check if user is already registered
          const userData = localStorage.getItem(`user_${address}`);
          if (userData) {
            setIsExistingUser(true);
            // Auto-redirect existing users after 2 seconds
            setTimeout(() => {
              navigate('/citizen-dashboard-grievance-filing');
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    }
  };

  const handleWalletConnected = (address) => {
    setWalletAddress(address);
    setConnectionError('');
    
    // Check if user is already registered
    const userData = localStorage.getItem(`user_${address}`);
    if (userData) {
      setIsExistingUser(true);
      // Auto-redirect existing users
      setTimeout(() => {
        navigate('/citizen-dashboard-grievance-filing');
      }, 2000);
    } else {
      // Show registration form for new users
      setShowRegistrationForm(true);
    }
  };

  const handleConnectionError = (error) => {
    setConnectionError(error);
    setWalletAddress('');
  };

  const handleRegistrationComplete = (userData) => {
    setShowRegistrationForm(false);
    setIsExistingUser(true);
    
    // Show success message and redirect
    setTimeout(() => {
      navigate('/citizen-dashboard-grievance-filing');
    }, 2000);
  };

  const handleRegistrationCancel = () => {
    setShowRegistrationForm(false);
    setWalletAddress('');
  };

  const handleProceedToDashboard = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/citizen-dashboard-grievance-filing');
    }, 1000);
  };

  const handleViewPublicData = () => {
    navigate('/national-public-leaderboard');
  };

  const handleAdminAccess = () => {
    navigate('/admin-authentication-portal');
  };

  return (
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
                <p className="text-sm text-muted-foreground font-caption">Citizen Authentication Portal</p>
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

          {/* Right Column - Authentication */}
          <div className="flex flex-col items-center justify-start space-y-6">
            {/* Connection Error */}
            {connectionError && (
              <div className="w-full max-w-md bg-error bg-opacity-10 border border-error text-error p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={20} />
                  <div>
                    <h3 className="font-body font-medium">Connection Error</h3>
                    <p className="text-sm font-caption">{connectionError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Existing User Welcome */}
            {isExistingUser && walletAddress && (
              <div className="bg-card border border-border rounded-lg p-8 shadow-government max-w-md w-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="UserCheck" size={32} color="white" />
                  </div>
                  <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
                    Welcome Back!
                  </h2>
                  <p className="text-muted-foreground mb-6 font-body">
                    Your wallet is connected and verified. You can now access your dashboard.
                  </p>
                  
                  <div className="bg-muted p-3 rounded-lg mb-6">
                    <p className="text-xs text-muted-foreground mb-1 font-caption">Connected Address:</p>
                    <p className="font-mono text-sm text-foreground break-all">
                      {walletAddress}
                    </p>
                  </div>

                  <Button
                    variant="default"
                    onClick={handleProceedToDashboard}
                    loading={isLoading}
                    iconName="ArrowRight"
                    iconPosition="right"
                    iconSize={16}
                    fullWidth
                  >
                    {isLoading ? 'Loading Dashboard...' : 'Go to Dashboard'}
                  </Button>

                  <p className="text-xs text-muted-foreground mt-4 font-caption">
                    Redirecting automatically in 2 seconds...
                  </p>
                </div>
              </div>
            )}

            {/* Wallet Connection Card */}
            {!isExistingUser && (
              <WalletConnectionCard
                onWalletConnected={handleWalletConnected}
                onConnectionError={handleConnectionError}
              />
            )}

            {/* Help Section */}
            <div className="w-full max-w-md space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-body font-medium text-foreground mb-2 flex items-center">
                  <Icon name="HelpCircle" size={16} className="mr-2 text-primary" />
                  Need Help?
                </h3>
                <div className="space-y-2 text-xs text-muted-foreground font-caption">
                  <p>• Install MetaMask browser extension</p>
                  <p>• Create or import your wallet</p>
                  <p>• Connect to Ethereum mainnet</p>
                  <p>• Ensure you have a small amount of ETH for transactions</p>
                </div>
              </div>

              <div className="text-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => window.open('https://metamask.io/faqs/', '_blank')}
                  iconName="ExternalLink"
                  iconPosition="right"
                  iconSize={14}
                >
                  MetaMask Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <UserRegistrationForm
          walletAddress={walletAddress}
          onRegistrationComplete={handleRegistrationComplete}
          onCancel={handleRegistrationCancel}
        />
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
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
                Empowering citizens through transparent, blockchain-secured governance.
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
  );
};

export default MetaMaskAuthenticationRegistration;