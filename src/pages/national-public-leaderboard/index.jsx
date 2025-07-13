import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NationalSummaryCard from './components/NationalSummaryCard';
import StateRankingCard from './components/StateRankingCard';
import StateRankingTable from './components/StateRankingTable';
import FilterControls from './components/FilterControls';
import TrustIndicators from './components/TrustIndicators';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const NationalPublicLeaderboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('resolution-rate');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('12 Jul 2025, 12:30 PM IST');

  // Mock national summary data
  const nationalSummary = [
    {
      title: 'Total Grievances',
      value: '2,45,678',
      subtitle: 'Across all states this month',
      trend: 12.5,
      icon: 'FileText',
      color: 'primary'
    },
    {
      title: 'Overall Resolution Rate',
      value: '78.4%',
      subtitle: 'National average performance',
      trend: 5.2,
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      title: 'Avg Resolution Time',
      value: '14.2 days',
      subtitle: 'Faster than last month',
      trend: -8.1,
      icon: 'Clock',
      color: 'warning'
    },
    {
      title: 'Active States',
      value: '28',
      subtitle: 'All states participating',
      trend: 0,
      icon: 'MapPin',
      color: 'secondary'
    }
  ];

  // Mock state ranking data
  const [stateRankings] = useState([
    {
      id: 1,
      rank: 1,
      name: 'Kerala',
      resolutionRate: 92.5,
      totalGrievances: 8456,
      avgResolutionTime: 8.2,
      trend: 3.2,
      resolvedCount: 7822,
      inProgressCount: 634
    },
    {
      id: 2,
      rank: 2,
      name: 'Tamil Nadu',
      resolutionRate: 89.7,
      totalGrievances: 15234,
      avgResolutionTime: 9.8,
      trend: 2.1,
      resolvedCount: 13665,
      inProgressCount: 1569
    },
    {
      id: 3,
      rank: 3,
      name: 'Karnataka',
      resolutionRate: 87.3,
      totalGrievances: 12890,
      avgResolutionTime: 11.5,
      trend: 1.8,
      resolvedCount: 11253,
      inProgressCount: 1637
    },
    {
      id: 4,
      rank: 4,
      name: 'Maharashtra',
      resolutionRate: 84.6,
      totalGrievances: 18567,
      avgResolutionTime: 12.3,
      trend: -0.5,
      resolvedCount: 15708,
      inProgressCount: 2859
    },
    {
      id: 5,
      rank: 5,
      name: 'Gujarat',
      resolutionRate: 82.1,
      totalGrievances: 9876,
      avgResolutionTime: 13.7,
      trend: 4.2,
      resolvedCount: 8108,
      inProgressCount: 1768
    },
    {
      id: 6,
      rank: 6,
      name: 'Rajasthan',
      resolutionRate: 79.8,
      totalGrievances: 11234,
      avgResolutionTime: 15.2,
      trend: 2.8,
      resolvedCount: 8965,
      inProgressCount: 2269
    },
    {
      id: 7,
      rank: 7,
      name: 'Andhra Pradesh',
      resolutionRate: 77.4,
      totalGrievances: 7890,
      avgResolutionTime: 16.8,
      trend: 1.5,
      resolvedCount: 6107,
      inProgressCount: 1783
    },
    {
      id: 8,
      rank: 8,
      name: 'Telangana',
      resolutionRate: 75.9,
      totalGrievances: 6543,
      avgResolutionTime: 17.5,
      trend: 3.7,
      resolvedCount: 4966,
      inProgressCount: 1577
    },
    {
      id: 9,
      rank: 9,
      name: 'West Bengal',
      resolutionRate: 73.2,
      totalGrievances: 13456,
      avgResolutionTime: 18.9,
      trend: -1.2,
      resolvedCount: 9850,
      inProgressCount: 3606
    },
    {
      id: 10,
      rank: 10,
      name: 'Uttar Pradesh',
      resolutionRate: 71.8,
      totalGrievances: 25678,
      avgResolutionTime: 21.3,
      trend: 0.8,
      resolvedCount: 18437,
      inProgressCount: 7241
    },
    {
      id: 11,
      rank: 11,
      name: 'Madhya Pradesh',
      resolutionRate: 69.5,
      totalGrievances: 9876,
      avgResolutionTime: 22.7,
      trend: -0.3,
      resolvedCount: 6864,
      inProgressCount: 3012
    },
    {
      id: 12,
      rank: 12,
      name: 'Punjab',
      resolutionRate: 67.3,
      totalGrievances: 5432,
      avgResolutionTime: 24.1,
      trend: 2.1,
      resolvedCount: 3656,
      inProgressCount: 1776
    }
  ]);

  const handleStateClick = (state) => {
    navigate(`/state-specific-performance-dashboard?state=${state.name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }));
      setIsLoading(false);
    }, 1500);
  };

  const handleAccessCitizenPortal = () => {
    navigate('/citizen-auth');
  };

  const handleAccessAdminPortal = () => {
    navigate('/admin-authentication-portal');
  };

  return (
    <div className="min-h-screen bg-background">      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            National Public Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground font-body max-w-3xl mx-auto">
            Transparent state-wise performance rankings based on grievance resolution rates, 
            response times, and citizen satisfaction across India's digital governance platform.
          </p>
        </div>

        {/* National Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {nationalSummary.map((summary, index) => (
            <NationalSummaryCard
              key={index}
              title={summary.title}
              value={summary.value}
              subtitle={summary.subtitle}
              trend={summary.trend}
              icon={summary.icon}
              color={summary.color}
            />
          ))}
        </div>

        {/* Filter Controls */}
        <FilterControls
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
          onRefresh={handleRefreshData}
          lastUpdated={lastUpdated}
        />

        {/* State Rankings Section */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                State Performance Rankings
              </h2>
              <p className="text-muted-foreground font-body">
                Click on any state to view detailed performance dashboard
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Icon name="Info" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-caption">
                Ranked by {selectedMetric.replace('-', ' ')} for {selectedPeriod} period
              </span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-muted-foreground font-body">Refreshing data...</span>
              </div>
            </div>
          )}

          {/* Mobile Card View */}
          {!isLoading && (
            <div className="lg:hidden space-y-4">
              {stateRankings.map((state) => (
                <StateRankingCard
                  key={state.id}
                  state={state}
                  onClick={handleStateClick}
                />
              ))}
            </div>
          )}

          {/* Desktop Table View */}
          {!isLoading && (
            <StateRankingTable
              states={stateRankings}
              onStateClick={handleStateClick}
            />
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12">
          <TrustIndicators />
        </div>

        {/* Call to Action Section */}
        <div className="mt-12 bg-card rounded-lg border border-border p-6 sm:p-8 text-center shadow-government">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
              Be Part of the Change
            </h3>
            <p className="text-muted-foreground font-body mb-6">
              Join thousands of citizens using CivicChain to file grievances, track progress, 
              and hold government accountable through blockchain transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                onClick={handleAccessCitizenPortal}
                iconName="Wallet"
                iconPosition="left"
                iconSize={20}
              >
                Access Citizen Portal
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleAccessAdminPortal}
                iconName="Shield"
                iconPosition="left"
                iconSize={20}
              >
                Government Admin Access
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-3">About CivicChain</h4>
              <p className="text-sm text-muted-foreground font-body">
                A revolutionary blockchain-based platform ensuring transparent and accountable 
                governance across India.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-3">Data Sources</h4>
              <p className="text-sm text-muted-foreground font-body">
                All data is sourced directly from government departments and verified 
                through blockchain consensus mechanisms.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-3">Contact</h4>
              <p className="text-sm text-muted-foreground font-body">
                For technical support or data inquiries, contact our 24/7 helpline 
                or visit the citizen portal.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border text-center">
            <div className="mb-4">
              <button
                onClick={() => navigate('/admin-authentication-portal')}
                className="text-xs text-gray-400 hover:text-gray-600 underline font-mono"
              >
                Admin Access Portal
              </button>
            </div>
            <p className="text-sm text-muted-foreground font-caption">
              © {new Date().getFullYear()} CivicChain - Government of India. All rights reserved. 
              Powered by blockchain technology for transparent governance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NationalPublicLeaderboard;