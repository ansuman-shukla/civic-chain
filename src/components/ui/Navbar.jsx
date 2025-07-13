import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Icon from '../AppIcon';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedState, setSelectedState] = useState('');

  const stateOptions = [
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
    { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
    { value: 'assam', label: 'Assam' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'chhattisgarh', label: 'Chhattisgarh' },
    { value: 'goa', label: 'Goa' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
    { value: 'jharkhand', label: 'Jharkhand' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'manipur', label: 'Manipur' },
    { value: 'meghalaya', label: 'Meghalaya' },
    { value: 'mizoram', label: 'Mizoram' },
    { value: 'nagaland', label: 'Nagaland' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'sikkim', label: 'Sikkim' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'tripura', label: 'Tripura' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
    { value: 'west-bengal', label: 'West Bengal' },
  ];

  const handleStateChange = (value) => {
    setSelectedState(value);
    if (value) {
      navigate(`/state-specific-performance-dashboard?state=${value}`);
    }
  };

  const isActiveRoute = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/national-public-leaderboard')) {
      return true;
    }
    return location.pathname === path;
  };

  const handleNavigation = (path, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated()) {
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-government">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <Icon name="Shield" size={20} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-heading font-semibold text-foreground">CivicChain</span>
                <span className="text-xs font-caption text-muted-foreground hidden sm:block">Public Transparency Portal</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('/')}
              className={`font-body font-medium transition-government ${
                isActiveRoute('/')
                  ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground hover:text-primary'
              }`}
            >
              National Rankings
            </button>
            <button
              onClick={() => handleNavigation('/state-specific-performance-dashboard')}
              className={`font-body font-medium transition-government ${
                isActiveRoute('/state-specific-performance-dashboard')
                  ? 'text-primary border-b-2 border-primary pb-1' : 'text-foreground hover:text-primary'
              }`}
            >
              State Rankings
            </button>
          </nav>

          {/* Right Section: State Selector & Auth */}
          <div className="flex items-center space-x-4">
            {/* State Selector - Desktop */}
            <div className="hidden lg:block w-48">
              <Select
                placeholder="Select State"
                options={stateOptions}
                value={selectedState}
                onChange={handleStateChange}
                searchable
                className="text-sm"
              />
            </div>

            {/* Auth Section */}
            {isAuthenticated() ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigation('/citizen-dashboard-grievance-filing', true)}
                  className="hidden sm:flex"
                >
                  <Icon name="User" size={16} className="mr-1" />
                  My Account
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-indigo-600" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.profile?.fullName?.split(' ')[0] || 'User'}
                    </p>
                    {user?.verification?.aadhaar && (
                      <p className="text-xs text-green-600 flex items-center">
                        <Icon name="CheckCircle" size={12} className="mr-1" />
                        Verified
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Icon name="LogOut" size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  <Icon name="Shield" size={16} className="mr-1" />
                  Secure Login
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/admin-authentication-portal')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Icon name="Settings" size={16} className="mr-1" />
                  Admin
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
