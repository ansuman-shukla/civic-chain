import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const WalletConnectionHeader = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsConnecting(true);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-government">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <Icon name="Shield" size={20} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-heading font-semibold text-foreground">CivicChain</span>
                <span className="text-xs font-caption text-muted-foreground hidden sm:block">Blockchain Governance Platform</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/citizen-dashboard-grievance-filing" className="text-foreground hover:text-primary transition-government font-body font-medium">
              Dashboard
            </a>
            <a href="/citizen-dashboard-grievance-filing" className="text-foreground hover:text-primary transition-government font-body font-medium">
              File Grievance
            </a>
            <a href="/national-public-leaderboard" className="text-muted-foreground hover:text-primary transition-government font-body font-medium">
              Public Data
            </a>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isWalletConnected ? (
              <div className="hidden sm:flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse-blockchain"></div>
                  <span className="font-mono text-sm text-foreground">{formatAddress(walletAddress)}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  iconName="LogOut"
                  iconPosition="left"
                  iconSize={16}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={connectWallet}
                loading={isConnecting}
                iconName="Wallet"
                iconPosition="left"
                iconSize={16}
                className="hidden sm:flex"
              >
                Connect Wallet
              </Button>
            )}

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
                href="/citizen-dashboard-grievance-filing"
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-government font-body font-medium"
              >
                Dashboard
              </a>
              <a
                href="/citizen-dashboard-grievance-filing"
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-government font-body font-medium"
              >
                File Grievance
              </a>
              <a
                href="/national-public-leaderboard"
                className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-government font-body font-medium"
              >
                Public Data
              </a>
              
              {/* Mobile Wallet Connection */}
              <div className="px-3 py-2 border-t border-border mt-2">
                {isWalletConnected ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse-blockchain"></div>
                      <span className="font-mono text-sm text-foreground">{formatAddress(walletAddress)}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={disconnectWallet}
                      iconName="LogOut"
                      iconPosition="left"
                      iconSize={16}
                      fullWidth
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={connectWallet}
                    loading={isConnecting}
                    iconName="Wallet"
                    iconPosition="left"
                    iconSize={16}
                    fullWidth
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default WalletConnectionHeader;