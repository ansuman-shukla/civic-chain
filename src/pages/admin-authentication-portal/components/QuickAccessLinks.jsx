import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickAccessLinks = () => {
  const quickLinks = [
    {
      title: "Public Transparency Portal",
      description: "View public grievance data and performance metrics",
      icon: "Globe",
      href: "/national-public-leaderboard",
      variant: "outline"
    },
    {
      title: "Citizen Registration",
      description: "Access citizen wallet registration portal",
      icon: "Wallet",
      href: "/meta-mask-authentication-registration",
      variant: "ghost"
    },
    {
      title: "System Documentation",
      description: "Admin guides and technical documentation",
      icon: "BookOpen",
      href: "#",
      variant: "ghost"
    },
    {
      title: "Emergency Contacts",
      description: "Technical support and escalation contacts",
      icon: "Phone",
      href: "#",
      variant: "ghost"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
        Quick Access
      </h3>
      
      <div className="space-y-3">
        {quickLinks.map((link, index) => (
          <div key={index} className="group">
            <a 
              href={link.href}
              className="block p-4 rounded-lg border border-border hover:border-primary transition-government bg-muted hover:bg-muted/50"
              target={link.href.startsWith('http') ? '_blank' : '_self'}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-government">
                  <Icon name={link.icon} size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-body font-medium text-foreground group-hover:text-primary transition-government">
                    {link.title}
                  </h4>
                  <p className="text-xs font-caption text-muted-foreground mt-1">
                    {link.description}
                  </p>
                </div>
                <Icon 
                  name="ExternalLink" 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary transition-government" 
                />
              </div>
            </a>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="HelpCircle" size={16} className="text-muted-foreground" />
            <span className="text-sm font-caption text-muted-foreground">Need Help?</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessLinks;