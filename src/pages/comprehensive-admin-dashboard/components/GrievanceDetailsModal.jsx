import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const GrievanceDetailsModal = ({ grievance, isOpen, onClose, onStatusUpdate }) => {
  if (!isOpen || !grievance) return null;

  const statusOptions = [
    { value: 'raised', label: 'Raised' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'failed', label: 'Failed' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      raised: { color: 'bg-warning text-warning-foreground', label: 'Raised' },
      in_progress: { color: 'bg-primary text-primary-foreground', label: 'In Progress' },
      resolved: { color: 'bg-success text-success-foreground', label: 'Resolved' },
      failed: { color: 'bg-error text-error-foreground', label: 'Failed' }
    };
    
    const config = statusConfig[status] || statusConfig.raised;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-caption font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(grievance.grievanceId, newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-government-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground">
                Grievance #{grievance.grievanceId}
              </h2>
              <p className="text-sm font-body text-muted-foreground">
                Submitted on {formatDate(grievance.submittedAt)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={24} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm font-caption text-muted-foreground mb-1">Current Status</p>
                {getStatusBadge(grievance.status)}
              </div>
              <div>
                <p className="text-sm font-caption text-muted-foreground mb-1">Priority</p>
                <span className={`px-3 py-1 rounded-full text-sm font-caption font-medium ${
                  grievance.priority === 'urgent' ? 'bg-error text-error-foreground' :
                  grievance.priority === 'high' ? 'bg-warning text-warning-foreground' :
                  grievance.priority === 'medium' ? 'bg-primary text-primary-foreground' :
                  'bg-secondary text-secondary-foreground'
                }`}>
                  {grievance.priority?.charAt(0).toUpperCase() + grievance.priority?.slice(1) || 'Medium'}
                </span>
              </div>
            </div>
            <div className="w-48">
              <Select
                label="Update Status"
                options={statusOptions}
                value={grievance.status}
                onChange={handleStatusChange}
              />
            </div>
          </div>

          {/* Citizen Information */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-3">Citizen Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-caption text-muted-foreground">Full Name</p>
                <p className="text-sm font-body text-foreground">{grievance.citizenName}</p>
              </div>
              <div>
                <p className="text-sm font-caption text-muted-foreground">Email Address</p>
                <p className="text-sm font-body text-foreground">{grievance.citizenEmail}</p>
              </div>
              <div>
                <p className="text-sm font-caption text-muted-foreground">Phone Number</p>
                <p className="text-sm font-body text-foreground">{grievance.citizenPhone}</p>
              </div>
              <div>
                <p className="text-sm font-caption text-muted-foreground">Wallet Address</p>
                <p className="text-sm font-mono text-foreground">{grievance.walletAddress}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-caption text-muted-foreground">Address</p>
                <p className="text-sm font-body text-foreground">{grievance.citizenAddress}</p>
              </div>
            </div>
          </div>

          {/* Grievance Details */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-3">Grievance Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-caption text-muted-foreground">Department</p>
                  <p className="text-sm font-body text-foreground">{grievance.department}</p>
                </div>
                <div>
                  <p className="text-sm font-caption text-muted-foreground">State</p>
                  <p className="text-sm font-body text-foreground">{grievance.state}</p>
                </div>
                <div>
                  <p className="text-sm font-caption text-muted-foreground">Category</p>
                  <p className="text-sm font-body text-foreground">{grievance.category || 'General'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-caption text-muted-foreground mb-2">Description</p>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm font-body text-foreground leading-relaxed">
                    {grievance.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Information */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-3">Blockchain Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-caption text-muted-foreground">Transaction Hash</p>
                <p className="text-sm font-mono text-foreground break-all">{grievance.transactionHash}</p>
              </div>
              <div>
                <p className="text-sm font-caption text-muted-foreground">Block Number</p>
                <p className="text-sm font-mono text-foreground">{grievance.blockNumber}</p>
              </div>
              <div>
                <p className="text-sm font-caption text-muted-foreground">Gas Used</p>
                <p className="text-sm font-mono text-foreground">{grievance.gasUsed}</p>
              </div>
              <div>
                <p className="text-sm font-caption text-muted-foreground">Confirmation Status</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm font-caption text-success">Confirmed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-3">Status Timeline</h3>
            <div className="space-y-3">
              {grievance.timeline?.map((event, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    event.status === 'resolved' ? 'bg-success text-success-foreground' :
                    event.status === 'in_progress' ? 'bg-primary text-primary-foreground' :
                    event.status === 'failed' ? 'bg-error text-error-foreground' :
                    'bg-warning text-warning-foreground'
                  }`}>
                    <Icon 
                      name={
                        event.status === 'resolved' ? 'CheckCircle' :
                        event.status === 'in_progress' ? 'Clock' :
                        event.status === 'failed' ? 'XCircle' : 'Plus'
                      } 
                      size={16} 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-body text-foreground">{event.description}</p>
                    <p className="text-xs font-caption text-muted-foreground">{formatDate(event.timestamp)}</p>
                  </div>
                </div>
              )) || (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-warning text-warning-foreground flex items-center justify-center">
                    <Icon name="Plus" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-body text-foreground">Grievance submitted</p>
                    <p className="text-xs font-caption text-muted-foreground">{formatDate(grievance.submittedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="default"
            iconName="ExternalLink"
            iconPosition="left"
            iconSize={16}
            onClick={() => window.open(`https://etherscan.io/tx/${grievance.transactionHash}`, '_blank')}
          >
            View on Blockchain
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrievanceDetailsModal;