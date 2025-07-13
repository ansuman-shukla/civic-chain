import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Government Certified',
      description: 'Official government platform with digital certification',
      color: 'text-success'
    },
    {
      icon: 'Lock',
      title: 'SSL Secured',
      description: 'End-to-end encryption for all data transmission',
      color: 'text-primary'
    },
    {
      icon: 'Database',
      title: 'Blockchain Verified',
      description: 'Immutable records stored on distributed ledger',
      color: 'text-accent'
    },
    {
      icon: 'Eye',
      title: 'Transparent Process',
      description: 'Public visibility of grievance resolution progress',
      color: 'text-secondary'
    }
  ];

  const partnerships = [
    {
      name: 'Digital India',
      description: 'Part of Digital India initiative'
    },
    {
      name: 'MyGov',
      description: 'Integrated with MyGov platform'
    },
    {
      name: 'Blockchain Council',
      description: 'Certified blockchain implementation'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-government">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center">
          <Icon name="ShieldCheck" size={20} className="mr-2 text-success" />
          Security & Trust Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trustFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                <Icon name={feature.icon} size={16} />
              </div>
              <div>
                <h4 className="font-body font-medium text-foreground text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground font-caption">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Government Partnerships */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-government">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Building" size={20} className="mr-2 text-primary" />
          Official Partnerships
        </h3>
        <div className="space-y-3">
          {partnerships.map((partnership, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div>
                <span className="font-body font-medium text-foreground text-sm">{partnership.name}</span>
                <span className="text-xs text-muted-foreground font-caption ml-2">- {partnership.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-government">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2 text-accent" />
          Platform Impact
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-primary">2.5L+</div>
            <div className="text-xs text-muted-foreground font-caption">Grievances Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-success">85%</div>
            <div className="text-xs text-muted-foreground font-caption">Resolution Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-accent">28</div>
            <div className="text-xs text-muted-foreground font-caption">States Connected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-secondary">15 Days</div>
            <div className="text-xs text-muted-foreground font-caption">Avg. Resolution</div>
          </div>
        </div>
      </div>

      {/* Compliance Information */}
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-xs text-muted-foreground font-caption">
            <p className="mb-2">
              <strong>Data Protection:</strong> All personal information is encrypted and stored securely in compliance with IT Act 2000 and Digital Personal Data Protection Act 2023.
            </p>
            <p>
              <strong>Blockchain Security:</strong> Grievance records are immutably stored on blockchain ensuring transparency and preventing tampering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;