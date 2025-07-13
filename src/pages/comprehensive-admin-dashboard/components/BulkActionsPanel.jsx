import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActionsPanel = ({ selectedGrievances, onBulkStatusUpdate, onSelectAll, onClearSelection }) => {
  const [bulkStatus, setBulkStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const statusOptions = [
    { value: 'in_progress', label: 'Mark as In Progress' },
    { value: 'resolved', label: 'Mark as Resolved' },
    { value: 'failed', label: 'Mark as Failed' }
  ];

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedGrievances.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onBulkStatusUpdate(selectedGrievances, bulkStatus);
      setBulkStatus('');
    } catch (error) {
      console.error('Bulk update failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedGrievances.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-government mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked
              onChange={onClearSelection}
              label={`${selectedGrievances.length} selected`}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              iconName="CheckSquare"
              iconPosition="left"
              iconSize={16}
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              Clear Selection
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-48">
            <Select
              placeholder="Select action"
              options={statusOptions}
              value={bulkStatus}
              onChange={setBulkStatus}
            />
          </div>
          
          <Button
            variant="default"
            onClick={handleBulkUpdate}
            loading={isProcessing}
            disabled={!bulkStatus}
            iconName="Play"
            iconPosition="left"
            iconSize={16}
          >
            Apply to {selectedGrievances.length} items
          </Button>
        </div>
      </div>

      {/* Bulk Action Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6 text-sm font-caption text-muted-foreground">
          <span>Selected: {selectedGrievances.length} grievances</span>
          <span>•</span>
          <span>Action: {bulkStatus ? statusOptions.find(opt => opt.value === bulkStatus)?.label : 'None selected'}</span>
          {bulkStatus && (
            <>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Icon name="AlertTriangle" size={14} className="text-warning" />
                <span className="text-warning">This action will update blockchain records</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkActionsPanel;