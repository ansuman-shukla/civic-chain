import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Grievances',
      value: stats.total,
      icon: 'FileText',
      color: 'bg-primary',
      description: 'All grievances filed'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: 'CheckCircle',
      color: 'bg-success',
      description: 'Successfully resolved'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: 'RefreshCw',
      color: 'bg-accent',
      description: 'Currently being worked on'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: 'Clock',
      color: 'bg-warning',
      description: 'Awaiting review'
    }
  ];

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-card rounded-lg shadow-government border border-border p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <Icon name={stat.icon} size={20} color="white" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-sm font-body font-medium text-foreground">{stat.title}</p>
                <p className="text-xs font-caption text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resolution Rate */}
      <div className="bg-card rounded-lg shadow-government border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Resolution Rate</h3>
            <p className="text-sm font-body text-muted-foreground">Percentage of grievances resolved</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-heading font-bold text-success">{resolutionRate}%</p>
            <p className="text-sm font-caption text-muted-foreground">Success rate</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-success h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${resolutionRate}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs font-caption text-muted-foreground mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-card rounded-lg shadow-government border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Quick Insights</h3>
        
        <div className="space-y-3">
          {stats.total === 0 ? (
            <div className="text-center py-8">
              <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-body text-muted-foreground">No grievances filed yet</p>
              <p className="text-xs font-caption text-muted-foreground">File your first grievance to get started</p>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Icon name="TrendingUp" size={16} className="text-success" />
                <div>
                  <p className="text-sm font-body font-medium text-foreground">
                    {stats.resolved} out of {stats.total} grievances resolved
                  </p>
                  <p className="text-xs font-caption text-muted-foreground">
                    {resolutionRate >= 70 ? 'Excellent' : resolutionRate >= 50 ? 'Good' : 'Needs improvement'} resolution rate
                  </p>
                </div>
              </div>
              
              {stats.inProgress > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                  <Icon name="Activity" size={16} className="text-accent" />
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">
                      {stats.inProgress} grievance{stats.inProgress > 1 ? 's' : ''} in progress
                    </p>
                    <p className="text-xs font-caption text-muted-foreground">
                      Departments are actively working on your issues
                    </p>
                  </div>
                </div>
              )}
              
              {stats.pending > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-warning/10 rounded-lg">
                  <Icon name="Clock" size={16} className="text-warning" />
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">
                      {stats.pending} grievance{stats.pending > 1 ? 's' : ''} pending review
                    </p>
                    <p className="text-xs font-caption text-muted-foreground">
                      These will be assigned to departments soon
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;