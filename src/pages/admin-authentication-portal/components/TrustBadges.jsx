import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustBadges = () => {
  const badges = [
    {
      icon: "Award",
      title: "Government Certified",
      subtitle: "Ministry of Electronics & IT"
    },
    {
      icon: "Shield",
      title: "ISO 27001 Compliant",
      subtitle: "Information Security"
    },
    {
      icon: "CheckCircle",
      title: "Digital India Initiative",
      subtitle: "Official Partner"
    },
    {
      icon: "Globe",
      title: "National Blockchain Network",
      subtitle: "Verified Node"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4 text-center">
        Trusted by Government of India
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name={badge.icon} size={20} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium text-foreground">
                {badge.title}
              </p>
              <p className="text-xs font-caption text-muted-foreground">
                {badge.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;