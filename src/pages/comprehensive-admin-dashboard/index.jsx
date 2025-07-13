import React, { useState, useEffect } from 'react';
import AdminSecurityWrapper from '../../components/ui/AdminSecurityWrapper';
import MetricsCard from './components/MetricsCard';
import GrievanceTable from './components/GrievanceTable';
import FilterPanel from './components/FilterPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import AIInsightsPanel from './components/AIInsightsPanel';
import GrievanceDetailsModal from './components/GrievanceDetailsModal';
import BulkActionsPanel from './components/BulkActionsPanel';

import Button from '../../components/ui/Button';

const ComprehensiveAdminDashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrievances, setSelectedGrievances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    state: '',
    department: '',
    status: '',
    priority: ''
  });

  // Mock data for grievances
  const mockGrievances = [
    {
      grievanceId: "GRV001",
      citizenName: "Rajesh Kumar",
      citizenEmail: "rajesh.kumar@email.com",
      citizenPhone: "+91 9876543210",
      citizenAddress: "123 MG Road, Bangalore, Karnataka 560001",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      description: `The streetlights on MG Road have been non-functional for the past two weeks. This has created safety concerns for pedestrians and commuters during evening hours.\n\nThe issue affects approximately 500 meters of the main road, causing significant inconvenience to local businesses and residents. Multiple complaints have been filed with the local municipal office but no action has been taken.`,
      department: "public-works",
      state: "karnataka",
      status: "raised",
      priority: "high",
      submittedAt: "2025-01-10T14:30:00Z",
      transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      blockNumber: "18567890",
      gasUsed: "21000",
      category: "Infrastructure",
      timeline: [
        {
          status: "raised",
          description: "Grievance submitted by citizen",
          timestamp: "2025-01-10T14:30:00Z"
        }
      ]
    },
    {
      grievanceId: "GRV002",
      citizenName: "Priya Sharma",
      citizenEmail: "priya.sharma@email.com",
      citizenPhone: "+91 9876543211",
      citizenAddress: "456 Civil Lines, Delhi 110001",
      walletAddress: "0x2345678901bcdef12345678901bcdef123456789",
      description: "Water supply has been irregular in our area for the past month. We receive water only for 2 hours in the morning, which is insufficient for daily needs.",
      department: "water-supply",
      state: "delhi",
      status: "in_progress",
      priority: "urgent",
      submittedAt: "2025-01-08T09:15:00Z",
      transactionHash: "0xbcdef1234567890bcdef1234567890bcdef1234567890bcdef1234567890a",
      blockNumber: "18567891",
      gasUsed: "21000",
      category: "Utilities",
      timeline: [
        {
          status: "raised",
          description: "Grievance submitted by citizen",
          timestamp: "2025-01-08T09:15:00Z"
        },
        {
          status: "in_progress",
          description: "Assigned to Water Supply Department",
          timestamp: "2025-01-09T10:30:00Z"
        }
      ]
    },
    {
      grievanceId: "GRV003",
      citizenName: "Amit Patel",
      citizenEmail: "amit.patel@email.com",
      citizenPhone: "+91 9876543212",
      citizenAddress: "789 Ashram Road, Ahmedabad, Gujarat 380009",
      walletAddress: "0x3456789012cdef123456789012cdef1234567890",
      description: "The local government school lacks basic facilities like proper toilets and drinking water. Children are facing difficulties attending classes.",
      department: "education",
      state: "gujarat",
      status: "resolved",
      priority: "high",
      submittedAt: "2025-01-05T11:45:00Z",
      transactionHash: "0xcdef1234567890cdef1234567890cdef1234567890cdef1234567890b",
      blockNumber: "18567892",
      gasUsed: "21000",
      category: "Education",
      timeline: [
        {
          status: "raised",
          description: "Grievance submitted by citizen",
          timestamp: "2025-01-05T11:45:00Z"
        },
        {
          status: "in_progress",
          description: "Assigned to Education Department",
          timestamp: "2025-01-06T08:20:00Z"
        },
        {
          status: "resolved",
          description: "Facilities upgraded and issue resolved",
          timestamp: "2025-01-12T16:00:00Z"
        }
      ]
    },
    {
      grievanceId: "GRV004",
      citizenName: "Sunita Reddy",
      citizenEmail: "sunita.reddy@email.com",
      citizenPhone: "+91 9876543213",
      citizenAddress: "321 Tank Bund Road, Hyderabad, Telangana 500001",
      walletAddress: "0x456789013def123456789013def12345678901",
      description: "Potholes on the main road are causing accidents and vehicle damage. Immediate repair is needed.",
      department: "transport",
      state: "telangana",
      status: "failed",
      priority: "medium",
      submittedAt: "2025-01-07T16:20:00Z",
      transactionHash: "0xdef1234567890def1234567890def1234567890def1234567890c",
      blockNumber: "18567893",
      gasUsed: "21000",
      category: "Transportation"
    },
    {
      grievanceId: "GRV005",
      citizenName: "Vikram Singh",
      citizenEmail: "vikram.singh@email.com",
      citizenPhone: "+91 9876543214",
      citizenAddress: "654 Mall Road, Shimla, Himachal Pradesh 171001",
      walletAddress: "0x56789014ef123456789014ef123456789012",
      description: "Electricity outages are frequent in our locality. Power cuts last for 6-8 hours daily affecting work and daily life.",
      department: "electricity",
      state: "himachal-pradesh",
      status: "in_progress",
      priority: "high",
      submittedAt: "2025-01-09T13:10:00Z",
      transactionHash: "0xef1234567890ef1234567890ef1234567890ef1234567890d",
      blockNumber: "18567894",
      gasUsed: "21000",
      category: "Utilities"
    }
  ];

  // Mock analytics data
  const mockAnalyticsData = {
    resolutionTrends: [
      { month: 'Jan', resolved: 45, raised: 60 },
      { month: 'Feb', resolved: 52, raised: 58 },
      { month: 'Mar', resolved: 48, raised: 55 },
      { month: 'Apr', resolved: 61, raised: 62 },
      { month: 'May', resolved: 55, raised: 59 },
      { month: 'Jun', resolved: 67, raised: 65 }
    ],
    departmentPerformance: [
      { department: 'Public Works', resolutionRate: 78 },
      { department: 'Health', resolutionRate: 85 },
      { department: 'Education', resolutionRate: 72 },
      { department: 'Transport', resolutionRate: 68 },
      { department: 'Water Supply', resolutionRate: 81 }
    ],
    statusDistribution: [
      { name: 'Raised', value: 35 },
      { name: 'In Progress', value: 28 },
      { name: 'Resolved', value: 32 },
      { name: 'Failed', value: 5 }
    ],
    recentActivity: [
      {
        type: 'resolved',
        description: 'Grievance #GRV003 marked as resolved',
        timestamp: '2 hours ago'
      },
      {
        type: 'raised',
        description: 'New grievance #GRV005 submitted',
        timestamp: '4 hours ago'
      },
      {
        type: 'in_progress',
        description: 'Grievance #GRV002 assigned to department',
        timestamp: '6 hours ago'
      }
    ]
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setGrievances(mockGrievances);
      setFilteredGrievances(mockGrievances);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = grievances;

    if (filters.state) {
      filtered = filtered.filter(g => g.state === filters.state);
    }
    if (filters.department) {
      filtered = filtered.filter(g => g.department === filters.department);
    }
    if (filters.status) {
      filtered = filtered.filter(g => g.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter(g => g.priority === filters.priority);
    }

    setFilteredGrievances(filtered);
  }, [filters, grievances]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      state: '',
      department: '',
      status: '',
      priority: ''
    });
  };

  const handleStatusUpdate = async (grievanceId, newStatus) => {
    try {
      // Simulate blockchain transaction
      setGrievances(prev => prev.map(g => 
        g.grievanceId === grievanceId 
          ? { ...g, status: newStatus }
          : g
      ));
      
      // Show success notification (you can implement toast here)
      console.log(`Grievance ${grievanceId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleViewDetails = (grievance) => {
    setSelectedGrievance(grievance);
    setIsModalOpen(true);
  };

  const handleBulkStatusUpdate = async (grievanceIds, newStatus) => {
    try {
      setGrievances(prev => prev.map(g => 
        grievanceIds.includes(g.grievanceId)
          ? { ...g, status: newStatus }
          : g
      ));
      setSelectedGrievances([]);
      console.log(`Bulk update: ${grievanceIds.length} grievances updated to ${newStatus}`);
    } catch (error) {
      console.error('Bulk update failed:', error);
    }
  };

  const handleSelectAll = () => {
    setSelectedGrievances(filteredGrievances.map(g => g.grievanceId));
  };

  const handleClearSelection = () => {
    setSelectedGrievances([]);
  };

  // Calculate metrics
  const totalGrievances = grievances.length;
  const resolvedGrievances = grievances.filter(g => g.status === 'resolved').length;
  const inProgressGrievances = grievances.filter(g => g.status === 'in_progress').length;
  const resolutionRate = totalGrievances > 0 ? Math.round((resolvedGrievances / totalGrievances) * 100) : 0;

  if (isLoading) {
    return (
      <AdminSecurityWrapper>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg font-body text-foreground">Loading dashboard...</span>
          </div>
        </div>
      </AdminSecurityWrapper>
    );
  }

  return (
    <AdminSecurityWrapper>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-lg font-body text-muted-foreground mt-2">
                  Comprehensive grievance management with AI-powered analytics
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                >
                  Export Data
                </Button>
                <Button
                  variant="default"
                  iconName="RefreshCw"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total Grievances"
              value={totalGrievances.toLocaleString()}
              change="+12% from last month"
              changeType="positive"
              icon="FileText"
              color="primary"
            />
            <MetricsCard
              title="Resolution Rate"
              value={`${resolutionRate}%`}
              change="+5% from last month"
              changeType="positive"
              icon="CheckCircle"
              color="success"
            />
            <MetricsCard
              title="In Progress"
              value={inProgressGrievances.toLocaleString()}
              change="-8% from last month"
              changeType="negative"
              icon="Clock"
              color="warning"
            />
            <MetricsCard
              title="Avg Resolution Time"
              value="4.2 days"
              change="-1.2 days from last month"
              changeType="positive"
              icon="Timer"
              color="secondary"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filter Panel */}
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                grievanceCount={filteredGrievances.length}
              />

              {/* Bulk Actions */}
              <BulkActionsPanel
                selectedGrievances={selectedGrievances}
                onBulkStatusUpdate={handleBulkStatusUpdate}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
              />

              {/* Grievances Table */}
              <GrievanceTable
                grievances={filteredGrievances}
                onStatusUpdate={handleStatusUpdate}
                onViewDetails={handleViewDetails}
              />
            </div>

            {/* Analytics Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* AI Insights Panel */}
              <AIInsightsPanel grievances={grievances} />
              
              {/* Traditional Analytics Panel */}
              <AnalyticsPanel analyticsData={mockAnalyticsData} />
            </div>
          </div>
        </div>

        {/* Grievance Details Modal */}
        <GrievanceDetailsModal
          grievance={selectedGrievance}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </AdminSecurityWrapper>
  );
};

export default ComprehensiveAdminDashboard;