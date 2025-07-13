import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletConnectionCard = ({ onWalletConnected, onConnectionError }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);

  useEffect(() => {
    checkWalletInstallation();
    checkExistingConnection();
  }, []);

  const checkWalletInstallation = () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsWalletInstalled(true);
    } else {
      setIsWalletInstalled(false);
    }
  };

  const checkExistingConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          onWalletConnected(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!isWalletInstalled) {
      onConnectionError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        onWalletConnected(accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        onConnectionError('Connection rejected by user. Please try again.');
      } else {
        onConnectionError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  if (!isWalletInstalled) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 shadow-government max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertTriangle" size={32} color="white" />
          </div>
          <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
            MetaMask Required
          </h2>
          <p className="text-muted-foreground mb-6 font-body">
            You need MetaMask wallet to access the CivicChain platform. Please install MetaMask browser extension to continue.
          </p>
          <Button
            variant="default"
            onClick={installMetaMask}
            iconName="Download"
            iconPosition="left"
            iconSize={20}
            fullWidth
          >
            Install MetaMask
          </Button>
          <p className="text-xs text-muted-foreground mt-4 font-caption">
            MetaMask is a secure cryptocurrency wallet & gateway to blockchain apps
          </p>
        </div>
      </div>
    );
  }

  if (walletAddress) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 shadow-government max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} color="white" />
          </div>
          <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
            Wallet Connected
          </h2>
          <p className="text-muted-foreground mb-4 font-body">
            Your MetaMask wallet is successfully connected
          </p>
          <div className="bg-muted p-3 rounded-lg mb-6">
            <p className="text-xs text-muted-foreground mb-1 font-caption">Connected Address:</p>
            <p className="font-mono text-sm text-foreground break-all">
              {walletAddress}
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2 text-success">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-blockchain"></div>
            <span className="text-sm font-caption">Blockchain Connected</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-government max-w-md w-full">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Wallet" size={32} color="white" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-muted-foreground mb-6 font-body">
          Connect your MetaMask wallet to access the CivicChain grievance platform securely through blockchain technology.
        </p>
        
        <Button
          variant="default"
          onClick={connectWallet}
          loading={isConnecting}
          iconName="Wallet"
          iconPosition="left"
          iconSize={20}
          fullWidth
          className="mb-4"
        >
          {isConnecting ? 'Connecting...' : 'Connect MetaMask Wallet'}
        </Button>

        {/* Security Features */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="font-body">Government Certified Platform</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Icon name="Lock" size={16} className="text-success" />
            <span className="font-body">Blockchain Secured Transactions</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Icon name="Eye" size={16} className="text-success" />
            <span className="font-body">Transparent & Immutable Records</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-caption">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default WalletConnectionCard;