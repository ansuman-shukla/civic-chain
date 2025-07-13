import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GrievanceHistoryCard = ({ grievance, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Raised':
        return {
          color: 'bg-warning text-warning-foreground',
          icon: 'Clock',
          description: 'Your grievance has been submitted and is awaiting review'
        };
      case 'In Progress':
        return {
          color: 'bg-accent text-accent-foreground',
          icon: 'RefreshCw',
          description: 'Your grievance is being actively worked on by the department'
        };
      case 'Resolved':
        return {
          color: 'bg-success text-success-foreground',
          icon: 'CheckCircle',
          description: 'Your grievance has been successfully resolved'
        };
      case 'Failed':
        return {
          color: 'bg-error text-error-foreground',
          icon: 'XCircle',
          description: 'Your grievance could not be resolved at this time'
        };
      default:
        return {
          color: 'bg-muted text-muted-foreground',
          icon: 'HelpCircle',
          description: 'Status unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(grievance.status);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-card rounded-lg shadow-government border border-border overflow-hidden transition-government hover:shadow-government-lg">
      {/* Card Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-lg font-heading font-semibold text-foreground">
                #{grievance.id}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-caption font-medium ${statusConfig.color}`}>
                <Icon name={statusConfig.icon} size={12} className="mr-1" />
                {grievance.status}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm font-body text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Icon name="Building" size={14} />
                <span>{grievance.department}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{formatDate(grievance.submittedAt)}</span>
              </span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
            className="ml-2"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <p className="text-sm font-body text-foreground mb-3 line-clamp-2">
          {grievance.description}
        </p>
        
        <div className="flex items-center justify-between text-xs font-caption text-muted-foreground">
          <span>Submitted {getDaysAgo(grievance.submittedAt)}</span>
          <span>{formatTime(grievance.submittedAt)}</span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/30">
          <div className="p-4 space-y-4">
            {/* Status Description */}
            <div className="bg-background rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <Icon name={statusConfig.icon} size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-body font-medium text-foreground mb-1">Current Status</p>
                  <p className="text-sm font-body text-muted-foreground">{statusConfig.description}</p>
                </div>
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="bg-background rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <Icon name="Link" size={16} className="text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-body font-medium text-foreground mb-1">Blockchain Record</p>
                  <p className="text-xs font-mono text-muted-foreground mb-2">
                    Hash: {grievance.blockchainHash}
                  </p>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onViewDetails(grievance)}
                    iconName="ExternalLink"
                    iconPosition="right"
                    iconSize={12}
                  >
                    View on Blockchain
                  </Button>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {grievance.timeline && grievance.timeline.length > 0 && (
              <div className="bg-background rounded-lg p-3">
                <p className="text-sm font-body font-medium text-foreground mb-3">Timeline</p>
                <div className="space-y-2">
                  {grievance.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-body text-foreground">{event.action}</p>
                        <p className="text-xs font-caption text-muted-foreground">
                          {formatDate(event.timestamp)} at {formatTime(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(grievance)}
                iconName="Eye"
                iconPosition="left"
                iconSize={14}
                className="flex-1"
              >
                View Details
              </Button>
              {grievance.status === 'Resolved' && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1"
                >
                  Download Report
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceHistoryCard;