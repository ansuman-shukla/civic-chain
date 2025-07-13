import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: 'bg-primary text-primary-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      error: 'bg-error text-error-foreground',
      secondary: 'bg-secondary text-secondary-foreground'
    };
    return colors[colorType] || colors.primary;
  };

  const getChangeColor = (type) => {
    return type === 'positive' ? 'text-success' : type === 'negative' ? 'text-error' : 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-government">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-caption text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <Icon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={16} 
                className={getChangeColor(changeType)}
              />
              <span className={`text-sm font-body ml-1 ${getChangeColor(changeType)}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} color="currentColor" />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;