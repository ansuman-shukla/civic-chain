import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const indicators = [
    {
      icon: 'Shield',
      title: 'Government Verified',
      description: 'Official Government of India Platform'
    },
    {
      icon: 'Lock',
      title: 'Blockchain Secured',
      description: 'Immutable data on distributed ledger'
    },
    {
      icon: 'Eye',
      title: 'Transparent Data',
      description: 'Real-time public access to all metrics'
    },
    {
      icon: 'Clock',
      title: 'Live Updates',
      description: 'Data refreshed every 15 minutes'
    }
  ];

  return (
    <div className="bg-muted rounded-lg border border-border p-4 sm:p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Data Transparency & Security
        </h3>
        <p className="text-sm text-muted-foreground font-body">
          This platform ensures complete transparency and data integrity through blockchain technology
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((indicator, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-card rounded-lg border border-border">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={indicator.icon} size={16} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-heading font-semibold text-foreground">
                {indicator.title}
              </h4>
              <p className="text-xs text-muted-foreground font-body mt-1">
                {indicator.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse-blockchain"></div>
            <span className="text-sm font-caption text-muted-foreground">
              Blockchain Network: Active
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs font-caption text-muted-foreground">
            <span>SSL Secured</span>
            <span>•</span>
            <span>ISO 27001 Certified</span>
            <span>•</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;