import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityIndicators = () => {
  const securityFeatures = [
    {
      icon: "Shield",
      title: "SSL Encrypted",
      description: "256-bit encryption",
      status: "active"
    },
    {
      icon: "Lock",
      title: "Two-Factor Auth",
      description: "Enhanced security",
      status: "active"
    },
    {
      icon: "Eye",
      title: "Session Monitoring",
      description: "Real-time tracking",
      status: "active"
    },
    {
      icon: "Server",
      title: "Secure Infrastructure",
      description: "Government grade",
      status: "active"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {securityFeatures.map((feature, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
            <Icon name={feature.icon} size={16} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-medium text-foreground truncate">
              {feature.title}
            </p>
            <p className="text-xs font-caption text-muted-foreground truncate">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SecurityIndicators;