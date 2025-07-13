import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PublicGrievanceBrowser = ({ grievances, departments, stateName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'failed', label: 'Failed/Rejected' }
  ];

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...departments.map(dept => ({ value: dept.id, label: dept.name }))
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' }
  ];

  const filteredGrievances = useMemo(() => {
    return grievances.filter(grievance => {
      const matchesSearch = grievance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           grievance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           grievance.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = !selectedDepartment || grievance.departmentId === selectedDepartment;
      const matchesStatus = !selectedStatus || grievance.status === selectedStatus;
      
      let matchesDate = true;
      if (dateRange) {
        const days = parseInt(dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        matchesDate = new Date(grievance.filedDate) >= cutoffDate;
      }

      return matchesSearch && matchesDepartment && matchesStatus && matchesDate;
    });
  }, [grievances, searchTerm, selectedDepartment, selectedStatus, dateRange]);

  const paginatedGrievances = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGrievances.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGrievances, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredGrievances.length / itemsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'resolved': { color: 'bg-green-500', text: 'Resolved', icon: 'CheckCircle' },
      'in-progress': { color: 'bg-yellow-500', text: 'In Progress', icon: 'Clock' },
      'failed': { color: 'bg-red-500', text: 'Failed', icon: 'XCircle' }
    };
    return statusConfig[status] || statusConfig['in-progress'];
  };

  const getDepartmentName = (departmentId) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept ? dept.name : 'Unknown Department';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedStatus('');
    setDateRange('');
    setCurrentPage(1);
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground mb-2">
          Public Grievance Browser
        </h3>
        <p className="text-muted-foreground font-body">
          Search and explore anonymized grievance data from {stateName} for transparency
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-government">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            type="search"
            placeholder="Search grievances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <Select
            placeholder="Filter by department"
            options={departmentOptions}
            value={selectedDepartment}
            onChange={setSelectedDepartment}
          />
          
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
          />
          
          <Select
            placeholder="Filter by date"
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-caption text-muted-foreground">
            Showing {filteredGrievances.length} of {grievances.length} grievances
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Grievances Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {paginatedGrievances.map((grievance) => {
          const statusBadge = getStatusBadge(grievance.status);
          return (
            <div key={grievance.id} className="bg-card border border-border rounded-lg p-6 shadow-government hover:shadow-government-lg transition-government">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-mono text-sm text-primary font-semibold">#{grievance.id}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-caption font-medium text-white ${statusBadge.color}`}>
                      <Icon name={statusBadge.icon} size={12} className="mr-1" />
                      {statusBadge.text}
                    </span>
                  </div>
                  <h4 className="font-body font-semibold text-foreground mb-2 line-clamp-2">
                    {grievance.title}
                  </h4>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-body text-muted-foreground line-clamp-3">
                  {grievance.description}
                </p>

                <div className="flex items-center space-x-4 text-sm font-caption text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Building" size={14} />
                    <span>{getDepartmentName(grievance.departmentId)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>{formatDate(grievance.filedDate)}</span>
                  </div>
                </div>

                {grievance.resolvedDate && (
                  <div className="flex items-center space-x-1 text-sm font-caption text-green-600">
                    <Icon name="CheckCircle" size={14} />
                    <span>Resolved on {formatDate(grievance.resolvedDate)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-xs font-caption text-muted-foreground">
                    Location: {grievance.location}
                  </div>
                  <div className="text-xs font-caption text-muted-foreground">
                    Priority: {grievance.priority}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredGrievances.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-heading font-semibold text-foreground mb-2">No grievances found</h4>
          <p className="text-muted-foreground font-body mb-4">
            Try adjusting your search criteria or clearing the filters
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm font-caption text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredGrievances.length)} of {filteredGrievances.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconPosition="left"
              iconSize={16}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm font-mono text-foreground">
              {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconPosition="right"
              iconSize={16}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicGrievanceBrowser;