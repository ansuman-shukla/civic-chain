import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DepartmentPerformanceTable = ({ departments, stateName }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'resolutionRate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const sortedDepartments = useMemo(() => {
    const sortableItems = [...departments];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [departments, sortConfig]);

  const paginatedDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedDepartments.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedDepartments, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(departments.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-primary" />
      : <Icon name="ArrowDown" size={16} className="text-primary" />;
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 80) return 'text-green-600 bg-green-50';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPerformanceBadge = (rate) => {
    if (rate >= 80) return { text: 'Excellent', color: 'bg-green-500' };
    if (rate >= 60) return { text: 'Good', color: 'bg-yellow-500' };
    return { text: 'Needs Improvement', color: 'bg-red-500' };
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground mb-2">
          Department Performance Analysis
        </h3>
        <p className="text-muted-foreground font-body">
          Detailed breakdown of grievance resolution by department in {stateName}
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-card border border-border rounded-lg shadow-government overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-2 font-body font-semibold text-foreground hover:text-primary transition-government"
                  >
                    <span>Department</span>
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleSort('totalGrievances')}
                    className="flex items-center justify-center space-x-2 font-body font-semibold text-foreground hover:text-primary transition-government w-full"
                  >
                    <span>Total Cases</span>
                    {getSortIcon('totalGrievances')}
                  </button>
                </th>
                <th className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleSort('resolutionRate')}
                    className="flex items-center justify-center space-x-2 font-body font-semibold text-foreground hover:text-primary transition-government w-full"
                  >
                    <span>Resolution Rate</span>
                    {getSortIcon('resolutionRate')}
                  </button>
                </th>
                <th className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleSort('avgResolutionTime')}
                    className="flex items-center justify-center space-x-2 font-body font-semibold text-foreground hover:text-primary transition-government w-full"
                  >
                    <span>Avg Resolution Time</span>
                    {getSortIcon('avgResolutionTime')}
                  </button>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="font-body font-semibold text-foreground">Performance</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleSort('rank')}
                    className="flex items-center justify-center space-x-2 font-body font-semibold text-foreground hover:text-primary transition-government w-full"
                  >
                    <span>State Rank</span>
                    {getSortIcon('rank')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedDepartments.map((dept, index) => {
                const badge = getPerformanceBadge(dept.resolutionRate);
                return (
                  <tr key={dept.id} className="border-t border-border hover:bg-muted/50 transition-government">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name={dept.icon} size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-body font-medium text-foreground">{dept.name}</p>
                          <p className="text-sm font-caption text-muted-foreground">{dept.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-foreground">{dept.totalGrievances.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className={`font-mono font-semibold ${getPerformanceColor(dept.resolutionRate)}`}>
                          {dept.resolutionRate}%
                        </span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${badge.color}`}
                            style={{ width: `${dept.resolutionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-foreground">{dept.avgResolutionTime} days</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-caption font-medium text-white ${badge.color}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono font-semibold text-foreground">#{dept.rank}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {paginatedDepartments.map((dept) => {
          const badge = getPerformanceBadge(dept.resolutionRate);
          return (
            <div key={dept.id} className="bg-card border border-border rounded-lg p-4 shadow-government">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={dept.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-body font-medium text-foreground">{dept.name}</h4>
                    <p className="text-sm font-caption text-muted-foreground">{dept.category}</p>
                  </div>
                </div>
                <span className="font-mono text-sm font-semibold text-foreground">#{dept.rank}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs font-caption text-muted-foreground mb-1">Total Cases</p>
                  <p className="font-mono font-semibold text-foreground">{dept.totalGrievances.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs font-caption text-muted-foreground mb-1">Avg Resolution</p>
                  <p className="font-mono font-semibold text-foreground">{dept.avgResolutionTime} days</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-caption text-muted-foreground">Resolution Rate</span>
                  <span className={`font-mono font-semibold ${getPerformanceColor(dept.resolutionRate)}`}>
                    {dept.resolutionRate}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${badge.color}`}
                    style={{ width: `${dept.resolutionRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-caption font-medium text-white ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm font-caption text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, departments.length)} of {departments.length} departments
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

export default DepartmentPerformanceTable;