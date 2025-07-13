import React from 'react';
import Icon from '../../../components/AppIcon';

const StateOverviewMetrics = ({ stateData, stateName }) => {
  const metrics = [
    {
      id: 'total',
      title: 'Total Grievances',
      value: stateData.totalGrievances,
      icon: 'FileText',
      color: 'bg-blue-500',
      trend: stateData.trends.total,
      description: 'All grievances filed'
    },
    {
      id: 'resolved',
      title: 'Resolved',
      value: stateData.resolvedGrievances,
      percentage: ((stateData.resolvedGrievances / stateData.totalGrievances) * 100).toFixed(1),
      icon: 'CheckCircle',
      color: 'bg-green-500',
      trend: stateData.trends.resolved,
      description: 'Successfully resolved'
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      value: stateData.inProgressGrievances,
      percentage: ((stateData.inProgressGrievances / stateData.totalGrievances) * 100).toFixed(1),
      icon: 'Clock',
      color: 'bg-yellow-500',
      trend: stateData.trends.inProgress,
      description: 'Currently being processed'
    },
    {
      id: 'failed',
      title: 'Failed/Rejected',
      value: stateData.failedGrievances,
      percentage: ((stateData.failedGrievances / stateData.totalGrievances) * 100).toFixed(1),
      icon: 'XCircle',
      color: 'bg-red-500',
      trend: stateData.trends.failed,
      description: 'Could not be resolved'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend > 0) return { icon: 'TrendingUp', color: 'text-green-600' };
    if (trend < 0) return { icon: 'TrendingDown', color: 'text-red-600' };
    return { icon: 'Minus', color: 'text-gray-500' };
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          {stateName} Performance Overview
        </h2>
        <p className="text-muted-foreground font-body">
          Comprehensive metrics for grievance resolution in {stateName}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric) => {
          const trendInfo = getTrendIcon(metric.trend);
          
          return (
            <div
              key={metric.id}
              className="bg-card border border-border rounded-lg p-6 shadow-government hover:shadow-government-lg transition-government"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
                  <Icon name={metric.icon} size={24} color="white" />
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name={trendInfo.icon} size={16} className={trendInfo.color} />
                  <span className={`text-sm font-mono ${trendInfo.color}`}>
                    {Math.abs(metric.trend)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-body font-medium text-muted-foreground">
                  {metric.title}
                </h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-heading font-bold text-foreground">
                    {metric.value.toLocaleString('en-IN')}
                  </span>
                  {metric.percentage && (
                    <span className="text-lg font-body font-medium text-muted-foreground">
                      ({metric.percentage}%)
                    </span>
                  )}
                </div>
                <p className="text-xs font-caption text-muted-foreground">
                  {metric.description}
                </p>
              </div>

              {/* Progress bar for percentage metrics */}
              {metric.percentage && (
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${metric.color}`}
                      style={{ width: `${metric.percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Stats Summary */}
      <div className="mt-6 bg-muted rounded-lg p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-2xl font-heading font-bold text-foreground">
              {((stateData.resolvedGrievances / stateData.totalGrievances) * 100).toFixed(1)}%
            </span>
            <p className="text-sm font-caption text-muted-foreground">Resolution Rate</p>
          </div>
          <div>
            <span className="text-2xl font-heading font-bold text-foreground">
              {stateData.avgResolutionTime}
            </span>
            <p className="text-sm font-caption text-muted-foreground">Avg Resolution Time</p>
          </div>
          <div>
            <span className="text-2xl font-heading font-bold text-foreground">
              {stateData.activeDepartments}
            </span>
            <p className="text-sm font-caption text-muted-foreground">Active Departments</p>
          </div>
          <div>
            <span className="text-2xl font-heading font-bold text-foreground">
              #{stateData.nationalRank}
            </span>
            <p className="text-sm font-caption text-muted-foreground">National Rank</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateOverviewMetrics;