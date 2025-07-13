import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeBanner = ({ user, onDismiss, isFirstTime }) => {
  const getUserName = () => {
    return user?.profile?.fullName || user?.email?.split('@')[0] || 'Citizen';
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!isFirstTime) return null;

  return (
    <div className="bg-gradient-to-r from-primary to-accent rounded-lg shadow-government-lg p-6 mb-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4">
          <Icon name="Shield" size={64} color="white" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Icon name="Users" size={48} color="white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon name="User" size={24} color="white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-white flex items-center">
                  {getCurrentGreeting()}, {getUserName()}!
                  {user?.verification?.aadhaar && (
                    <div className="ml-2 w-6 h-6 bg-white/20 backdrop-blur rounded-full flex items-center justify-center" title="Verified Account">
                      <Icon name="Check" size={14} color="white" />
                    </div>
                  )}
                </h2>
                <p className="text-sm font-caption text-white/80">
                  {user?.verification?.aadhaar ? '✅ Verified Account' : 'Welcome to CivicChain'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-white font-body">
                Welcome to CivicChain - India's first blockchain-powered grievance redressal platform. 
                Your voice matters, and we're here to ensure it's heard.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Shield" size={16} color="white" />
                    <span className="text-sm font-body font-medium text-white">Transparent</span>
                  </div>
                  <p className="text-xs font-caption text-white/80">
                    All grievances recorded on blockchain for complete transparency
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Zap" size={16} color="white" />
                    <span className="text-sm font-body font-medium text-white">AI-Powered</span>
                  </div>
                  <p className="text-xs font-caption text-white/80">
                    Smart routing to the right department using AI analysis
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Eye" size={16} color="white" />
                    <span className="text-sm font-body font-medium text-white">Trackable</span>
                  </div>
                  <p className="text-xs font-caption text-white/80">
                    Real-time status updates and complete audit trail
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => document.getElementById('grievance-form')?.scrollIntoView({ behavior: 'smooth' })}
                  iconName="MessageSquare"
                  iconPosition="left"
                  iconSize={16}
                >
                  File Your First Grievance
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => window.open('/national-public-leaderboard', '_blank')}
                  iconName="BarChart3"
                  iconPosition="left"
                  iconSize={16}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  View Public Data
                </Button>
              </div>
            </div>
          </div>

          {/* Dismiss Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="text-white hover:bg-white/10 ml-4"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;