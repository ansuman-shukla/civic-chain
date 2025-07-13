import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const GrievanceTable = ({ grievances, onStatusUpdate, onViewDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const itemsPerPage = 10;

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
      <span className={`px-2 py-1 rounded-full text-xs font-caption font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedGrievances = [...grievances].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'submittedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedGrievances = sortedGrievances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(grievances.length / itemsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 50) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-government">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-foreground">All Grievances</h3>
        <p className="text-sm font-body text-muted-foreground mt-1">
          Showing {paginatedGrievances.length} of {grievances.length} grievances
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('grievanceId')}
                  className="flex items-center space-x-1 text-sm font-caption font-medium text-foreground hover:text-primary transition-government"
                >
                  <span>ID</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-caption font-medium text-foreground">Citizen</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-caption font-medium text-foreground">Grievance</span>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center space-x-1 text-sm font-caption font-medium text-foreground hover:text-primary transition-government"
                >
                  <span>Department</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('state')}
                  className="flex items-center space-x-1 text-sm font-caption font-medium text-foreground hover:text-primary transition-government"
                >
                  <span>State</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-caption font-medium text-foreground">Status</span>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('submittedAt')}
                  className="flex items-center space-x-1 text-sm font-caption font-medium text-foreground hover:text-primary transition-government"
                >
                  <span>Submitted</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-caption font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedGrievances.map((grievance) => (
              <tr key={grievance.grievanceId} className="hover:bg-muted/50 transition-government">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-foreground">#{grievance.grievanceId}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">{grievance.citizenName}</p>
                    <p className="text-xs font-caption text-muted-foreground">{grievance.citizenEmail}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-body text-foreground" title={grievance.description}>
                    {truncateText(grievance.description)}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-body text-foreground">{grievance.department}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-body text-foreground">{grievance.state}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-32">
                    <Select
                      options={statusOptions}
                      value={grievance.status}
                      onChange={(value) => onStatusUpdate(grievance.grievanceId, value)}
                      className="text-xs"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-caption text-muted-foreground">
                    {formatDate(grievance.submittedAt)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(grievance)}
                    iconName="Eye"
                    iconPosition="left"
                    iconSize={16}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {paginatedGrievances.map((grievance) => (
          <div key={grievance.grievanceId} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-sm text-foreground">#{grievance.grievanceId}</span>
              {getStatusBadge(grievance.status)}
            </div>
            
            <div className="space-y-2 mb-3">
              <div>
                <p className="text-sm font-body font-medium text-foreground">{grievance.citizenName}</p>
                <p className="text-xs font-caption text-muted-foreground">{grievance.citizenEmail}</p>
              </div>
              
              <p className="text-sm font-body text-foreground">
                {truncateText(grievance.description, 80)}
              </p>
              
              <div className="flex items-center space-x-4 text-xs font-caption text-muted-foreground">
                <span>{grievance.department}</span>
                <span>•</span>
                <span>{grievance.state}</span>
              </div>
              
              <p className="text-xs font-caption text-muted-foreground">
                {formatDate(grievance.submittedAt)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Select
                  options={statusOptions}
                  value={grievance.status}
                  onChange={(value) => onStatusUpdate(grievance.grievanceId, value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(grievance)}
                iconName="Eye"
                iconSize={16}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-body text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
                iconSize={16}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
                iconSize={16}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceTable;