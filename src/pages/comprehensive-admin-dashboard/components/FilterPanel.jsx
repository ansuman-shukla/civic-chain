import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ filters, onFilterChange, onClearFilters, grievanceCount }) => {
  const stateOptions = [
    { value: '', label: 'All States' },
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
    { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
    { value: 'assam', label: 'Assam' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'chhattisgarh', label: 'Chhattisgarh' },
    { value: 'goa', label: 'Goa' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
    { value: 'jharkhand', label: 'Jharkhand' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'manipur', label: 'Manipur' },
    { value: 'meghalaya', label: 'Meghalaya' },
    { value: 'mizoram', label: 'Mizoram' },
    { value: 'nagaland', label: 'Nagaland' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'sikkim', label: 'Sikkim' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'tripura', label: 'Tripura' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
    { value: 'west-bengal', label: 'West Bengal' }
  ];

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'public-works', label: 'Public Works Department' },
    { value: 'health', label: 'Health Department' },
    { value: 'education', label: 'Education Department' },
    { value: 'transport', label: 'Transport Department' },
    { value: 'water-supply', label: 'Water Supply Department' },
    { value: 'electricity', label: 'Electricity Board' },
    { value: 'police', label: 'Police Department' },
    { value: 'revenue', label: 'Revenue Department' },
    { value: 'municipal', label: 'Municipal Corporation' },
    { value: 'forest', label: 'Forest Department' },
    { value: 'agriculture', label: 'Agriculture Department' },
    { value: 'social-welfare', label: 'Social Welfare Department' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'raised', label: 'Raised' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'failed', label: 'Failed' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const hasActiveFilters = filters.state || filters.department || filters.status || filters.priority;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-government">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Filter Grievances</h3>
          <p className="text-sm font-body text-muted-foreground mt-1">
            {grievanceCount} grievances found
          </p>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Select
            label="State"
            placeholder="Select state"
            options={stateOptions}
            value={filters.state}
            onChange={(value) => onFilterChange('state', value)}
            searchable
          />
        </div>

        <div>
          <Select
            label="Department"
            placeholder="Select department"
            options={departmentOptions}
            value={filters.department}
            onChange={(value) => onFilterChange('department', value)}
            searchable
          />
        </div>

        <div>
          <Select
            label="Status"
            placeholder="Select status"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => onFilterChange('status', value)}
          />
        </div>

        <div>
          <Select
            label="Priority"
            placeholder="Select priority"
            options={priorityOptions}
            value={filters.priority}
            onChange={(value) => onFilterChange('priority', value)}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {filters.state && (
              <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <span className="font-caption">
                  State: {stateOptions.find(opt => opt.value === filters.state)?.label}
                </span>
                <button
                  onClick={() => onFilterChange('state', '')}
                  className="ml-2 hover:bg-primary/20 rounded-full p-1 transition-government"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            
            {filters.department && (
              <div className="flex items-center bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                <span className="font-caption">
                  Dept: {departmentOptions.find(opt => opt.value === filters.department)?.label}
                </span>
                <button
                  onClick={() => onFilterChange('department', '')}
                  className="ml-2 hover:bg-secondary/20 rounded-full p-1 transition-government"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            
            {filters.status && (
              <div className="flex items-center bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                <span className="font-caption">
                  Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
                </span>
                <button
                  onClick={() => onFilterChange('status', '')}
                  className="ml-2 hover:bg-accent/20 rounded-full p-1 transition-government"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            
            {filters.priority && (
              <div className="flex items-center bg-warning/10 text-warning px-3 py-1 rounded-full text-sm">
                <span className="font-caption">
                  Priority: {priorityOptions.find(opt => opt.value === filters.priority)?.label}
                </span>
                <button
                  onClick={() => onFilterChange('priority', '')}
                  className="ml-2 hover:bg-warning/20 rounded-full p-1 transition-government"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;