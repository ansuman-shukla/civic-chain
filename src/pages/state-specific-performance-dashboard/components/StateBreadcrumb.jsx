import React from 'react';
import Icon from '../../../components/AppIcon';

const StateBreadcrumb = ({ stateName, stateCode }) => {
  return (
    <div className="bg-muted border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center space-x-2 text-sm font-caption">
          <a 
            href="/national-public-leaderboard" 
            className="text-muted-foreground hover:text-primary transition-government flex items-center space-x-1"
          >
            <Icon name="Home" size={16} />
            <span>National Leaderboard</span>
          </a>
          
          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          
          <span className="text-foreground font-medium flex items-center space-x-1">
            <Icon name="MapPin" size={16} />
            <span>{stateName} Performance Dashboard</span>
          </span>
        </nav>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              {stateName} State Dashboard
            </h1>
            <p className="text-sm font-body text-muted-foreground">
              Comprehensive grievance resolution analytics for {stateName} ({stateCode})
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs font-caption text-muted-foreground">Last Updated</p>
              <p className="text-sm font-mono text-foreground">
                {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-blockchain"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateBreadcrumb;