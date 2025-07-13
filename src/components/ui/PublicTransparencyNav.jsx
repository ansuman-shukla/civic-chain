import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const PublicTransparencyNav = () => {
  const [selectedState, setSelectedState] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
      window.location.href = `/state-specific-performance-dashboard?state=${value}`;
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
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
                <span className="text-xs font-caption text-muted-foreground hidden sm:block">Public Transparency Portal</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/national-public-leaderboard"
              className={`font-body font-medium transition-government ${
                isActiveRoute('/national-public-leaderboard')
                  ? 'text-primary border-b-2 border-primary pb-1' :'text-foreground hover:text-primary'
              }`}
            >
              National Rankings
            </a>
            <a
              href="/state-specific-performance-dashboard"
              className={`font-body font-medium transition-government ${
                isActiveRoute('/state-specific-performance-dashboard')
                  ? 'text-primary border-b-2 border-primary pb-1' :'text-foreground hover:text-primary'
              }`}
            >
              State Performance
            </a>
          </nav>

          {/* State Selector & Actions */}
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

            {/* Access Other Domains */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/citizen-auth'}
                iconName="Shield"
                iconPosition="left"
                iconSize={16}
              >
                Secure Login
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/admin-authentication-portal'}
                iconName="Shield"
                iconPosition="left"
                iconSize={16}
              >
                Admin
              </Button>
            </div>

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
                href="/national-public-leaderboard"
                className={`block px-3 py-2 rounded-md transition-government font-body font-medium ${
                  isActiveRoute('/national-public-leaderboard')
                    ? 'text-primary bg-muted' :'text-foreground hover:text-primary hover:bg-muted'
                }`}
              >
                National Rankings
              </a>
              <a
                href="/state-specific-performance-dashboard"
                className={`block px-3 py-2 rounded-md transition-government font-body font-medium ${
                  isActiveRoute('/state-specific-performance-dashboard')
                    ? 'text-primary bg-muted' :'text-foreground hover:text-primary hover:bg-muted'
                }`}
              >
                State Performance
              </a>

              {/* Mobile State Selector */}
              <div className="px-3 py-2">
                <Select
                  label="Select State"
                  placeholder="Choose a state"
                  options={stateOptions}
                  value={selectedState}
                  onChange={handleStateChange}
                  searchable
                />
              </div>

              {/* Mobile Domain Access */}
              <div className="px-3 py-2 border-t border-border mt-2 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/meta-mask-authentication-registration'}
                  iconName="Wallet"
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                >
                  Citizen Portal
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/admin-authentication-portal'}
                  iconName="Shield"
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                >
                  Admin Portal
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Breadcrumb Area - Only show on state dashboard */}
      {isActiveRoute('/state-specific-performance-dashboard') && selectedState && (
        <div className="bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center space-x-2 text-sm font-caption">
              <a href="/national-public-leaderboard" className="text-muted-foreground hover:text-primary transition-government">
                National
              </a>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              <span className="text-foreground font-medium">
                {stateOptions.find(state => state.value === selectedState)?.label || 'State Dashboard'}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicTransparencyNav;