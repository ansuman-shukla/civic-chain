import React from 'react';
import Icon from '../../../components/AppIcon';

const NationalSummaryCard = ({ title, value, subtitle, trend, icon, color = 'primary' }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: 'bg-primary text-primary-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      secondary: 'bg-secondary text-secondary-foreground'
    };
    return colors[colorType] || colors.primary;
  };

  const getTrendIcon = () => {
    if (trend > 0) return { name: 'TrendingUp', color: 'text-success' };
    if (trend < 0) return { name: 'TrendingDown', color: 'text-error' };
    return { name: 'Minus', color: 'text-muted-foreground' };
  };

  const trendIcon = getTrendIcon();

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-government transition-government hover:shadow-government-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} color="currentColor" />
        </div>
        <div className="flex items-center space-x-1">
          <Icon name={trendIcon.name} size={16} className={trendIcon.color} />
          <span className={`text-sm font-mono ${trendIcon.color}`}>
            {Math.abs(trend)}%
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-caption text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-3xl font-heading font-bold text-foreground">
          {value}
        </p>
        <p className="text-sm font-body text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default NationalSummaryCard;