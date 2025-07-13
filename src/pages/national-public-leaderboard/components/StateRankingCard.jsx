import React from 'react';
import Icon from '../../../components/AppIcon';

const StateRankingCard = ({ state, onClick }) => {
  const getPerformanceBadge = (rate) => {
    if (rate >= 85) return { label: 'Excellent', color: 'bg-success text-success-foreground' };
    if (rate >= 70) return { label: 'Good', color: 'bg-primary text-primary-foreground' };
    if (rate >= 50) return { label: 'Average', color: 'bg-warning text-warning-foreground' };
    return { label: 'Needs Improvement', color: 'bg-error text-error-foreground' };
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { name: 'ArrowUp', color: 'text-success' };
    if (trend < 0) return { name: 'ArrowDown', color: 'text-error' };
    return { name: 'Minus', color: 'text-muted-foreground' };
  };

  const badge = getPerformanceBadge(state.resolutionRate);
  const trendIcon = getTrendIcon(state.trend);

  return (
    <div 
      className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-government transition-government hover:shadow-government-lg cursor-pointer group"
      onClick={() => onClick(state)}
    >
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
              {state.rank}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-government">
                {state.name}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-caption ${badge.color}`}>
                {badge.label}
              </span>
            </div>
          </div>
          <Icon name="ChevronRight" size={20} className="text-muted-foreground group-hover:text-primary transition-government" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground font-caption">Resolution Rate</p>
            <p className="font-heading font-semibold text-foreground">{state.resolutionRate}%</p>
          </div>
          <div>
            <p className="text-muted-foreground font-caption">Total Grievances</p>
            <p className="font-heading font-semibold text-foreground">{state.totalGrievances.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-caption">Avg. Resolution</p>
            <p className="font-heading font-semibold text-foreground">{state.avgResolutionTime} days</p>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name={trendIcon.name} size={16} className={trendIcon.color} />
            <span className={`font-mono text-sm ${trendIcon.color}`}>
              {Math.abs(state.trend)}%
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-heading font-bold text-lg">
              {state.rank}
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-government">
                {state.name}
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-caption ${badge.color}`}>
                {badge.label}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <p className="text-2xl font-heading font-bold text-foreground">{state.resolutionRate}%</p>
              <p className="text-sm text-muted-foreground font-caption">Resolution Rate</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-heading font-semibold text-foreground">{state.totalGrievances.toLocaleString('en-IN')}</p>
              <p className="text-sm text-muted-foreground font-caption">Total Grievances</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-heading font-semibold text-foreground">{state.avgResolutionTime} days</p>
              <p className="text-sm text-muted-foreground font-caption">Avg. Resolution</p>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name={trendIcon.name} size={20} className={trendIcon.color} />
              <span className={`font-mono ${trendIcon.color}`}>
                {Math.abs(state.trend)}%
              </span>
            </div>
            <Icon name="ChevronRight" size={24} className="text-muted-foreground group-hover:text-primary transition-government" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateRankingCard;