import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FloatingActionButton = ({ onNewGrievance, hasGrievances }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNewGrievance = () => {
    setIsExpanded(false);
    onNewGrievance();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-card rounded-lg shadow-government-lg border border-border p-4 w-64 mb-2">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Icon name="MessageSquare" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-body font-medium text-foreground">File New Grievance</p>
                <p className="text-xs font-caption text-muted-foreground">
                  Report an issue to the government
                </p>
              </div>
            </div>
            
            <Button
              variant="default"
              onClick={handleNewGrievance}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              fullWidth
            >
              Start Filing
            </Button>
            
            {hasGrievances && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-caption text-muted-foreground mb-2">Quick Actions</p>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false);
                      document.getElementById('grievance-history')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    iconName="History"
                    iconPosition="left"
                    iconSize={14}
                    fullWidth
                  >
                    View History
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false);
                      window.open('/national-public-leaderboard', '_blank');
                    }}
                    iconName="BarChart3"
                    iconPosition="left"
                    iconSize={14}
                    fullWidth
                  >
                    Public Data
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main FAB */}
      <div className="relative">
        <Button
          variant="default"
          size="icon"
          onClick={toggleExpanded}
          className="w-14 h-14 rounded-full shadow-government-lg hover:shadow-xl transition-all duration-200"
        >
          <Icon name={isExpanded ? "X" : "Plus"} size={24} />
        </Button>
        
        {/* Notification Badge */}
        {!hasGrievances && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Sparkles" size={12} color="white" />
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;