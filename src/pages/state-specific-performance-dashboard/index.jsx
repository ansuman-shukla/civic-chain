import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StateBreadcrumb from './components/StateBreadcrumb';
import StateOverviewMetrics from './components/StateOverviewMetrics';
import DepartmentPerformanceTable from './components/DepartmentPerformanceTable';
import PerformanceCharts from './components/PerformanceCharts';
import PublicGrievanceBrowser from './components/PublicGrievanceBrowser';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const StateSpecificPerformanceDashboard = () => {
  const location = useLocation();
  const [selectedState, setSelectedState] = useState('');
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock state data
  const statesData = {
    'maharashtra': {
      name: 'Maharashtra',
      code: 'MH',
      totalGrievances: 45678,
      resolvedGrievances: 38234,
      inProgressGrievances: 5234,
      failedGrievances: 2210,
      avgResolutionTime: '12.5 days',
      activeDepartments: 28,
      nationalRank: 3,
      trends: {
        total: 8.5,
        resolved: 12.3,
        inProgress: -5.2,
        failed: -15.8
      }
    },
    'karnataka': {
      name: 'Karnataka',
      code: 'KA',
      totalGrievances: 38945,
      resolvedGrievances: 32156,
      inProgressGrievances: 4523,
      failedGrievances: 2266,
      avgResolutionTime: '14.2 days',
      activeDepartments: 25,
      nationalRank: 5,
      trends: {
        total: 6.8,
        resolved: 9.4,
        inProgress: -3.1,
        failed: -12.5
      }
    },
    'tamil-nadu': {
      name: 'Tamil Nadu',
      code: 'TN',
      totalGrievances: 42134,
      resolvedGrievances: 35789,
      inProgressGrievances: 4234,
      failedGrievances: 2111,
      avgResolutionTime: '11.8 days',
      activeDepartments: 30,
      nationalRank: 2,
      trends: {
        total: 7.2,
        resolved: 14.6,
        inProgress: -8.3,
        failed: -18.2
      }
    },
    'gujarat': {
      name: 'Gujarat',
      code: 'GJ',
      totalGrievances: 34567,
      resolvedGrievances: 29876,
      inProgressGrievances: 3456,
      failedGrievances: 1235,
      avgResolutionTime: '10.3 days',
      activeDepartments: 24,
      nationalRank: 1,
      trends: {
        total: 9.1,
        resolved: 16.8,
        inProgress: -12.4,
        failed: -22.1
      }
    }
  };

  // State-specific color schemes for departments
  const getStateColorScheme = (stateKey) => {
    const colorSchemes = {
      'maharashtra': {
        primary: '#FF6B35', // Orange theme
        bars: ['#FF6B35', '#FF8A50', '#FFA86B', '#FFC786', '#FFE5A1', '#FFF2CC'],
        accent: '#D2571C'
      },
      'karnataka': {
        primary: '#6B46C1', // Purple theme  
        bars: ['#6B46C1', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
        accent: '#553C9A'
      },
      'tamil-nadu': {
        primary: '#059669', // Green theme
        bars: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
        accent: '#047857'
      },
      'gujarat': {
        primary: '#DC2626', // Red theme
        bars: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'],
        accent: '#B91C1C'
      }
    };
    
    return colorSchemes[stateKey] || colorSchemes['maharashtra'];
  };

  // State-specific department data with varied performance for better visual distinction
  const getDepartmentsByState = (stateKey) => {
    const departmentData = {
      'maharashtra': [
        {
          id: 'pwd',
          name: 'Public Works Department',
          category: 'Infrastructure',
          icon: 'Construction',
          totalGrievances: 8945,
          resolutionRate: 94.2,
          avgResolutionTime: 6.5,
          rank: 1
        },
        {
          id: 'health',
          name: 'Health & Family Welfare',
          category: 'Healthcare',
          icon: 'Heart',
          totalGrievances: 7234,
          resolutionRate: 88.7,
          avgResolutionTime: 9.2,
          rank: 2
        },
        {
          id: 'education',
          name: 'Education Department',
          category: 'Education',
          icon: 'GraduationCap',
          totalGrievances: 6789,
          resolutionRate: 72.4,
          avgResolutionTime: 15.6,
          rank: 3
        },
        {
          id: 'transport',
          name: 'Transport Department',
          category: 'Transportation',
          icon: 'Car',
          totalGrievances: 5432,
          resolutionRate: 65.8,
          avgResolutionTime: 22.3,
          rank: 4
        },
        {
          id: 'police',
          name: 'Police Department',
          category: 'Law & Order',
          icon: 'Shield',
          totalGrievances: 4567,
          resolutionRate: 79.3,
          avgResolutionTime: 12.1,
          rank: 5
        },
        {
          id: 'revenue',
          name: 'Revenue Department',
          category: 'Administration',
          icon: 'FileText',
          totalGrievances: 3456,
          resolutionRate: 54.2,
          avgResolutionTime: 28.4,
          rank: 6
        }
      ],
      'karnataka': [
        {
          id: 'pwd',
          name: 'Public Works Department',
          category: 'Infrastructure',
          icon: 'Construction',
          totalGrievances: 7845,
          resolutionRate: 91.8,
          avgResolutionTime: 7.2,
          rank: 1
        },
        {
          id: 'health',
          name: 'Health & Family Welfare',
          category: 'Healthcare',
          icon: 'Heart',
          totalGrievances: 6234,
          resolutionRate: 84.5,
          avgResolutionTime: 10.8,
          rank: 2
        },
        {
          id: 'education',
          name: 'Education Department',
          category: 'Education',
          icon: 'GraduationCap',
          totalGrievances: 5789,
          resolutionRate: 76.9,
          avgResolutionTime: 14.2,
          rank: 3
        },
        {
          id: 'transport',
          name: 'Transport Department',
          category: 'Transportation',
          icon: 'Car',
          totalGrievances: 4432,
          resolutionRate: 58.7,
          avgResolutionTime: 25.8,
          rank: 4
        },
        {
          id: 'police',
          name: 'Police Department',
          category: 'Law & Order',
          icon: 'Shield',
          totalGrievances: 3567,
          resolutionRate: 82.4,
          avgResolutionTime: 11.5,
          rank: 5
        },
        {
          id: 'revenue',
          name: 'Revenue Department',
          category: 'Administration',
          icon: 'FileText',
          totalGrievances: 2456,
          resolutionRate: 48.6,
          avgResolutionTime: 31.2,
          rank: 6
        }
      ],
      'tamil-nadu': [
        {
          id: 'pwd',
          name: 'Public Works Department',
          category: 'Infrastructure',
          icon: 'Construction',
          totalGrievances: 9245,
          resolutionRate: 96.3,
          avgResolutionTime: 5.8,
          rank: 1
        },
        {
          id: 'health',
          name: 'Health & Family Welfare',
          category: 'Healthcare',
          icon: 'Heart',
          totalGrievances: 8134,
          resolutionRate: 92.1,
          avgResolutionTime: 7.5,
          rank: 2
        },
        {
          id: 'education',
          name: 'Education Department',
          category: 'Education',
          icon: 'GraduationCap',
          totalGrievances: 7289,
          resolutionRate: 85.6,
          avgResolutionTime: 11.3,
          rank: 3
        },
        {
          id: 'transport',
          name: 'Transport Department',
          category: 'Transportation',
          icon: 'Car',
          totalGrievances: 6132,
          resolutionRate: 71.2,
          avgResolutionTime: 16.8,
          rank: 4
        },
        {
          id: 'police',
          name: 'Police Department',
          category: 'Law & Order',
          icon: 'Shield',
          totalGrievances: 5267,
          resolutionRate: 87.9,
          avgResolutionTime: 9.7,
          rank: 5
        },
        {
          id: 'revenue',
          name: 'Revenue Department',
          category: 'Administration',
          icon: 'FileText',
          totalGrievances: 4156,
          resolutionRate: 62.8,
          avgResolutionTime: 24.6,
          rank: 6
        }
      ],
      'gujarat': [
        {
          id: 'pwd',
          name: 'Public Works Department',
          category: 'Infrastructure',
          icon: 'Construction',
          totalGrievances: 8745,
          resolutionRate: 97.8,
          avgResolutionTime: 4.2,
          rank: 1
        },
        {
          id: 'health',
          name: 'Health & Family Welfare',
          category: 'Healthcare',
          icon: 'Heart',
          totalGrievances: 7534,
          resolutionRate: 93.6,
          avgResolutionTime: 6.8,
          rank: 2
        },
        {
          id: 'education',
          name: 'Education Department',
          category: 'Education',
          icon: 'GraduationCap',
          totalGrievances: 6889,
          resolutionRate: 89.4,
          avgResolutionTime: 8.9,
          rank: 3
        },
        {
          id: 'transport',
          name: 'Transport Department',
          category: 'Transportation',
          icon: 'Car',
          totalGrievances: 5632,
          resolutionRate: 74.7,
          avgResolutionTime: 13.5,
          rank: 4
        },
        {
          id: 'police',
          name: 'Police Department',
          category: 'Law & Order',
          icon: 'Shield',
          totalGrievances: 4867,
          resolutionRate: 91.2,
          avgResolutionTime: 7.8,
          rank: 5
        },
        {
          id: 'revenue',
          name: 'Revenue Department',
          category: 'Administration',
          icon: 'FileText',
          totalGrievances: 3756,
          resolutionRate: 67.4,
          avgResolutionTime: 19.8,
          rank: 6
        }
      ]
    };
    
    return departmentData[stateKey] || departmentData['maharashtra'];
  };

  const mockDepartments = getDepartmentsByState(selectedState);

  const mockChartData = {
    monthlyTrends: [
      { month: 'Jan', filed: 3200, resolved: 2800 },
      { month: 'Feb', filed: 3400, resolved: 3100 },
      { month: 'Mar', filed: 3600, resolved: 3300 },
      { month: 'Apr', filed: 3800, resolved: 3500 },
      { month: 'May', filed: 4000, resolved: 3700 },
      { month: 'Jun', filed: 4200, resolved: 3900 },
      { month: 'Jul', filed: 4400, resolved: 4100 },
      { month: 'Aug', filed: 4600, resolved: 4300 },
      { month: 'Sep', filed: 4800, resolved: 4500 },
      { month: 'Oct', filed: 5000, resolved: 4700 },
      { month: 'Nov', filed: 5200, resolved: 4900 },
      { month: 'Dec', filed: 5400, resolved: 5100 }
    ],
    departmentComparison: mockDepartments.slice(0, 6).map(dept => ({
      name: dept.name.split(' ')[0],
      resolutionRate: dept.resolutionRate
    })),
    resolutionDistribution: [
      { name: 'Resolved', value: 38234 },
      { name: 'In Progress', value: 5234 },
      { name: 'Failed', value: 2210 }
    ],
    insights: {
      bestDepartment: 'Public Works Department',
      bestRate: 87.5,
      avgResolutionTime: '12.5',
      needsAttention: 3
    }
  };

  const mockGrievances = [
    {
      id: 'GRV-MH-2024-001234',
      title: 'Road repair needed on Main Street',
      description: `The main road connecting our locality to the city center has developed multiple potholes and cracks. This is causing significant inconvenience to daily commuters and poses safety risks.\n\nThe condition has worsened after the recent monsoon season, and immediate attention is required to prevent accidents.`,
      departmentId: 'pwd',
      status: 'resolved',
      filedDate: '2024-06-15',
      resolvedDate: '2024-06-28',
      location: 'Pune, Maharashtra',
      priority: 'High'
    },
    {
      id: 'GRV-MH-2024-001235',
      title: 'Water supply disruption in residential area',
      description: `Our residential area has been facing irregular water supply for the past two weeks. The water comes only for 2-3 hours in the morning, which is insufficient for daily needs.\n\nMany families are struggling to manage their daily water requirements, especially elderly residents and families with small children.`,
      departmentId: 'water',
      status: 'in-progress',
      filedDate: '2024-07-01',
      resolvedDate: null,
      location: 'Mumbai, Maharashtra',
      priority: 'Medium'
    },
    {
      id: 'GRV-MH-2024-001236',
      title: 'Electricity meter reading discrepancy',
      description: `There seems to be an error in my electricity bill calculation. The meter reading shows significantly higher consumption than actual usage.\n\nI have been monitoring my daily consumption and the bill amount doesn't match the recorded usage pattern.`,departmentId: 'electricity',status: 'resolved',filedDate: '2024-06-20',resolvedDate: '2024-07-05',location: 'Nagpur, Maharashtra',priority: 'Low'
    },
    {
      id: 'GRV-MH-2024-001237',title: 'School infrastructure improvement needed',
      description: `The local government school lacks basic infrastructure facilities. The building needs repair, and there are insufficient desks and chairs for students.\n\nThe condition is affecting the quality of education and student attendance in our area.`,
      departmentId: 'education',status: 'in-progress',filedDate: '2024-07-08',resolvedDate: null,location: 'Nashik, Maharashtra',priority: 'High'
    },
    {
      id: 'GRV-MH-2024-001238',title: 'Public transport frequency issue',
      description: `The bus service on Route 45 has reduced frequency during peak hours. This is causing overcrowding and delays for daily commuters.\n\nMany office workers and students are facing difficulties reaching their destinations on time.`,
      departmentId: 'transport',status: 'failed',filedDate: '2024-06-10',resolvedDate: null,location: 'Thane, Maharashtra',priority: 'Medium'
    },
    {
      id: 'GRV-MH-2024-001239',title: 'Healthcare facility equipment shortage',
      description: `The primary health center in our area lacks essential medical equipment. Patients are being referred to distant hospitals for basic treatments.\n\nThis is particularly challenging for elderly patients and emergency cases who need immediate medical attention.`,
      departmentId: 'health',status: 'in-progress',filedDate: '2024-07-03',resolvedDate: null,location: 'Aurangabad, Maharashtra',priority: 'High'
    }
  ];

  useEffect(() => {
    // Get state from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const stateParam = urlParams.get('state');
    
    if (stateParam && statesData[stateParam]) {
      setSelectedState(stateParam);
      setStateData(statesData[stateParam]);
    } else {
      // Default to Maharashtra if no state specified
      setSelectedState('maharashtra');
      setStateData(statesData['maharashtra']);
    }
    setLoading(false);
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-body">Loading state dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stateData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icon name="AlertTriangle" size={48} className="text-warning mx-auto mb-4" />
            <h2 className="text-xl font-heading font-bold text-foreground mb-2">State Not Found</h2>
            <p className="text-muted-foreground font-body mb-4">
              The requested state dashboard could not be found.
            </p>
            <Button
              variant="default"
              onClick={() => window.location.href = '/national-public-leaderboard'}
              iconName="ArrowLeft"
              iconPosition="left"
              iconSize={16}
            >
              Back to National Leaderboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StateBreadcrumb stateName={stateData.name} stateCode={stateData.code} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StateOverviewMetrics stateData={stateData} stateName={stateData.name} />
        <DepartmentPerformanceTable departments={mockDepartments} stateName={stateData.name} />
        <PerformanceCharts 
          chartData={mockChartData} 
          stateName={stateData.name}
          colorScheme={getStateColorScheme(selectedState)}
        />
        <PublicGrievanceBrowser 
          grievances={mockGrievances} 
          departments={mockDepartments} 
          stateName={stateData.name} 
        />
      </main>

      {/* Quick Actions Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4">Explore Other States</h4>
              <div className="space-y-2">
                {Object.entries(statesData).slice(0, 3).map(([key, state]) => (
                  <a
                    key={key}
                    href={`/state-specific-performance-dashboard?state=${key}`}
                    className="block text-sm font-body text-muted-foreground hover:text-primary transition-government"
                  >
                    {state.name} Dashboard
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="/national-public-leaderboard"
                  className="block text-sm font-body text-muted-foreground hover:text-primary transition-government"
                >
                  National Rankings
                </a>
                <a
                  href="/meta-mask-authentication-registration"
                  className="block text-sm font-body text-muted-foreground hover:text-primary transition-government"
                >
                  File a Grievance
                </a>
                <a
                  href="/admin-authentication-portal"
                  className="block text-sm font-body text-muted-foreground hover:text-primary transition-government"
                >
                  Admin Portal
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4">About CivicChain</h4>
              <p className="text-sm font-body text-muted-foreground mb-4">
                Transparent, blockchain-powered grievance resolution platform for better governance.
              </p>
              <div className="mb-2">
                <button
                  onClick={() => window.location.href = '/admin-authentication-portal'}
                  className="text-xs text-gray-400 hover:text-gray-600 underline font-mono"
                >
                  Admin Access Portal
                </button>
              </div>
              <div className="text-xs font-caption text-muted-foreground">
                © {new Date().getFullYear()} CivicChain. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StateSpecificPerformanceDashboard;