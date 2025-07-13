import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AadhaarVerificationPanel from '../../components/auth/AadhaarVerificationPanel';
import GrievanceFilingForm from './components/GrievanceFilingForm';
import GrievanceHistoryCard from './components/GrievanceHistoryCard';
import DashboardStats from './components/DashboardStats';
import FloatingActionButton from './components/FloatingActionButton';
import WelcomeBanner from './components/WelcomeBanner';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CitizenDashboardGrievanceFiling = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showToast, setShowToast] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Mock grievances data
  const mockGrievances = [
    {
      id: 'GRV-2025-001234',
      description: 'Water supply has been irregular in our area for the past two weeks. The municipal taps run dry most of the day, causing severe inconvenience to residents.',
      department: 'Water Supply & Sanitation',
      status: 'In Progress',
      submittedAt: '2025-01-10T09:30:00Z',
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      timeline: [
        { action: 'Grievance submitted', timestamp: '2025-01-10T09:30:00Z' },
        { action: 'Assigned to Water Department', timestamp: '2025-01-10T11:15:00Z' },
        { action: 'Field inspection scheduled', timestamp: '2025-01-11T14:20:00Z' }
      ]
    },
    {
      id: 'GRV-2025-001189',
      description: 'Street lights on MG Road have been non-functional for over a month. This poses safety concerns for pedestrians and vehicles during night hours.',
      department: 'Electricity & Power',
      status: 'Resolved',
      submittedAt: '2025-01-05T16:45:00Z',
      blockchainHash: '0x9876543210fedcba0987654321fedcba09876543',
      timeline: [
        { action: 'Grievance submitted', timestamp: '2025-01-05T16:45:00Z' },
        { action: 'Assigned to Electricity Department', timestamp: '2025-01-05T18:30:00Z' },
        { action: 'Repair work completed', timestamp: '2025-01-08T10:15:00Z' },
        { action: 'Issue resolved and verified', timestamp: '2025-01-08T15:30:00Z' }
      ]
    },
    {
      id: 'GRV-2025-001156',
      description: 'Potholes on the main connecting road have worsened after recent rains. Vehicles are getting damaged and it\'s becoming dangerous for commuters.',
      department: 'Roads & Transportation',
      status: 'Raised',
      submittedAt: '2025-01-03T12:20:00Z',
      blockchainHash: '0xabcdef1234567890fedcba0987654321abcdef12',
      timeline: [
        { action: 'Grievance submitted', timestamp: '2025-01-03T12:20:00Z' }
      ]
    }
  ];

  useEffect(() => {
    // Load user data and grievances for authenticated users
    const hasVisited = localStorage.getItem('citizenDashboardVisited');
    if (hasVisited) {
      setIsFirstTime(false);
      setShowWelcome(false);
    }
    // Load grievances
    setGrievances(mockGrievances);
  }, []);

  const loadUserData = () => {
    const hasVisited = localStorage.getItem('citizenDashboardVisited');
    if (hasVisited) {
      setIsFirstTime(false);
      setShowWelcome(false);
    }
  };

  const handleGrievanceSubmit = async (grievanceData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate blockchain submission
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newGrievance = {
        id: `GRV-2025-${String(Math.floor(Math.random() * 900000) + 100000)}`,
        description: grievanceData.description,
        department: grievanceData.department,
        status: 'Raised',
        submittedAt: new Date().toISOString(),
        blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        timeline: [
          { action: 'Grievance submitted', timestamp: new Date().toISOString() }
        ]
      };
      
      setGrievances(prev => [newGrievance, ...prev]);
      setShowToast({
        type: 'success',
        message: `Grievance ${newGrievance.id} submitted successfully!`
      });
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => setShowToast(null), 5000);
      
    } catch (error) {
      console.error('Error submitting grievance:', error);
      setShowToast({
        type: 'error',
        message: 'Failed to submit grievance. Please try again.'
      });
      setTimeout(() => setShowToast(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (grievance) => {
    // Mock blockchain explorer link
    const explorerUrl = `https://etherscan.io/tx/${grievance.blockchainHash}`;
    window.open(explorerUrl, '_blank');
  };

  const handleNewGrievance = () => {
    setActiveTab('file');
    document.getElementById('grievance-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('citizenDashboardVisited', 'true');
  };

  const calculateStats = () => {
    const total = grievances.length;
    const resolved = grievances.filter(g => g.status === 'Resolved').length;
    const inProgress = grievances.filter(g => g.status === 'In Progress').length;
    const pending = grievances.filter(g => g.status === 'Raised').length;
    
    return { total, resolved, inProgress, pending };
  };

  const stats = calculateStats();

  if (!isAuthenticated() || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="User" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-body">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm">
          <div className={`rounded-lg shadow-government-lg p-4 ${
            showToast.type === 'success' ? 'bg-success text-success-foreground' : 'bg-error text-error-foreground'
          }`}>
            <div className="flex items-center space-x-3">
              <Icon 
                name={showToast.type === 'success' ? 'CheckCircle' : 'XCircle'} 
                size={20} 
                color="white" 
              />
              <p className="text-sm font-body">{showToast.message}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowToast(null)}
                className="text-white hover:bg-white/10 ml-auto"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        {showWelcome && (
          <WelcomeBanner
            user={user}
            onDismiss={handleDismissWelcome}
            isFirstTime={isFirstTime}
          />
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-body font-medium text-sm transition-government ${
                  activeTab === 'dashboard' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="BarChart3" size={16} />
                  <span>Dashboard</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`py-2 px-1 border-b-2 font-body font-medium text-sm transition-government ${
                  activeTab === 'file' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="MessageSquare" size={16} />
                  <span>File Grievance</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-body font-medium text-sm transition-government ${
                  activeTab === 'history' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="History" size={16} />
                  <span>My Grievances</span>
                  {grievances.length > 0 && (
                    <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                      {grievances.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-body font-medium text-sm transition-government ${
                  activeTab === 'profile' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={16} />
                  <span>Profile & Security</span>
                  {user?.verification?.aadhaar ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                      Verify
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'dashboard' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Your Grievance Dashboard
                </h1>
                <p className="text-muted-foreground font-body">
                  Track your grievances and monitor resolution progress
                </p>
              </div>
              <DashboardStats stats={stats} />
            </div>
          )}

          {activeTab === 'file' && (
            <div id="grievance-form">
              <div className="mb-6">
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  File a New Grievance
                </h1>
                <p className="text-muted-foreground font-body">
                  Describe your issue and we'll route it to the appropriate department
                </p>
              </div>
              <GrievanceFilingForm
                onSubmit={handleGrievanceSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div id="grievance-history">
              <div className="mb-6">
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Your Grievances
                </h1>
                <p className="text-muted-foreground font-body">
                  View and track all your submitted grievances
                </p>
              </div>

              {grievances.length === 0 ? (
                <div className="bg-card rounded-lg shadow-government border border-border p-12 text-center">
                  <Icon name="MessageSquare" size={64} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    No Grievances Yet
                  </h3>
                  <p className="text-muted-foreground font-body mb-6">
                    You haven't filed any grievances yet. Start by filing your first grievance to get help with your issues.
                  </p>
                  <Button
                    variant="default"
                    onClick={() => setActiveTab('file')}
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                  >
                    File Your First Grievance
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {grievances.map((grievance) => (
                    <GrievanceHistoryCard
                      key={grievance.id}
                      grievance={grievance}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div id="profile-security">
              <div className="mb-6">
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Profile & Security
                </h1>
                <p className="text-muted-foreground font-body">
                  Manage your profile information and account security settings
                </p>
              </div>

              <div className="space-y-6">
                {/* User Profile Card */}
                <div className="bg-card rounded-lg shadow-government border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                        Profile Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your account details and personal information
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={logout}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Sign Out
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <div className="flex items-center">
                        <p className="text-foreground font-medium">{user?.profile?.fullName || 'Not provided'}</p>
                        {user?.verification?.aadhaar && (
                          <div className="ml-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center" title="Verified Account">
                            <Icon name="Check" size={12} color="white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-foreground font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                      <p className="text-foreground font-medium">{user?.profile?.phoneNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gender</label>
                      <p className="text-foreground font-medium">{user?.profile?.gender || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="text-foreground font-medium">
                        {user?.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                      <p className="text-foreground font-medium">{user?.profile?.occupation || 'Not provided'}</p>
                    </div>
                    {user?.profile?.address && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p className="text-foreground font-medium">
                          {[
                            user.profile.address.street,
                            user.profile.address.city,
                            user.profile.address.state,
                            user.profile.address.pincode
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Account Status</h4>
                        <p className="text-sm text-muted-foreground">Your account is active and verified</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${user?.verification?.email ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          <span className="text-muted-foreground">Email {user?.verification?.email ? 'Verified' : 'Pending'}</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${user?.verification?.aadhaar ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                          <span className="text-muted-foreground">Aadhaar {user?.verification?.aadhaar ? 'Verified' : 'Not Verified'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aadhaar Verification Panel */}
                <AadhaarVerificationPanel />

                {/* Account Stats */}
                <div className="bg-card rounded-lg shadow-government border border-border p-6">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                    Account Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{user?.grievanceCount || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Grievances</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{grievances.filter(g => g.status === 'Resolved').length}</div>
                      <div className="text-sm text-muted-foreground">Resolved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{grievances.filter(g => g.status === 'In Progress').length}</div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{grievances.filter(g => g.status === 'Raised').length}</div>
                      <div className="text-sm text-muted-foreground">Recently Filed</div>
                    </div>
                  </div>

                  {user?.lastLogin && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Last login: {new Date(user.lastLogin).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton
        onNewGrievance={handleNewGrievance}
        hasGrievances={grievances.length > 0}
      />
    </div>
  );
};

export default CitizenDashboardGrievanceFiling;