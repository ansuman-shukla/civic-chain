import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterControls = ({ 
  selectedPeriod, 
  onPeriodChange, 
  selectedMetric, 
  onMetricChange,
  onRefresh,
  lastUpdated 
}) => {
  const periodOptions = [
    { value: 'monthly', label: 'Last 30 Days' },
    { value: 'quarterly', label: 'Last 3 Months' },
    { value: 'yearly', label: 'Last 12 Months' },
    { value: 'all', label: 'All Time' }
  ];

  const metricOptions = [
    { value: 'resolution-rate', label: 'Resolution Rate' },
    { value: 'total-grievances', label: 'Total Grievances' },
    { value: 'avg-resolution-time', label: 'Average Resolution Time' },
    { value: 'citizen-satisfaction', label: 'Citizen Satisfaction' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-government">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-48">
            <Select
              label="Time Period"
              options={periodOptions}
              value={selectedPeriod}
              onChange={onPeriodChange}
              className="w-full"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select
              label="Ranking Metric"
              options={metricOptions}
              value={selectedMetric}
              onChange={onMetricChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="text-sm text-muted-foreground font-caption">
            Last updated: {lastUpdated}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={16}
          >
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;