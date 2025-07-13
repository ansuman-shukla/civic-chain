import React from 'react';
import Icon from '../../../components/AppIcon';

const StateRankingTable = ({ states, onStateClick }) => {
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

  return (
    <div className="hidden lg:block bg-card rounded-lg border border-border shadow-government overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-heading font-semibold text-foreground">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-heading font-semibold text-foreground">State</th>
              <th className="px-6 py-4 text-center text-sm font-heading font-semibold text-foreground">Performance</th>
              <th className="px-6 py-4 text-center text-sm font-heading font-semibold text-foreground">Resolution Rate</th>
              <th className="px-6 py-4 text-center text-sm font-heading font-semibold text-foreground">Total Grievances</th>
              <th className="px-6 py-4 text-center text-sm font-heading font-semibold text-foreground">Avg. Resolution Time</th>
              <th className="px-6 py-4 text-center text-sm font-heading font-semibold text-foreground">Trend</th>
              <th className="px-6 py-4 text-center text-sm font-heading font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {states.map((state) => {
              const badge = getPerformanceBadge(state.resolutionRate);
              const trendIcon = getTrendIcon(state.trend);
              
              return (
                <tr 
                  key={state.id} 
                  className="hover:bg-muted transition-government cursor-pointer group"
                  onClick={() => onStateClick(state)}
                >
                  <td className="px-6 py-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
                      {state.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-heading font-semibold text-foreground group-hover:text-primary transition-government">
                      {state.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-caption ${badge.color}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-heading font-bold text-foreground">{state.resolutionRate}%</span>
                      <div className="w-16 bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${state.resolutionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-heading font-semibold text-foreground">
                      {state.totalGrievances.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-heading font-semibold text-foreground">
                      {state.avgResolutionTime} days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Icon name={trendIcon.name} size={16} className={trendIcon.color} />
                      <span className={`font-mono text-sm ${trendIcon.color}`}>
                        {Math.abs(state.trend)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground group-hover:text-primary transition-government" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StateRankingTable;