import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceCharts = ({ chartData, stateName, colorScheme }) => {
  const [activeChart, setActiveChart] = useState('departments'); // Default to departments to show the new colors

  const chartTypes = [
    { id: 'trends', label: 'Monthly Trends', icon: 'TrendingUp' },
    { id: 'departments', label: 'Department Comparison', icon: 'BarChart3' },
    { id: 'resolution', label: 'Resolution Distribution', icon: 'PieChart' }
  ];

  // Use state-specific colors or fallback to default
  const COLORS = colorScheme?.bars || ['#1E40AF', '#059669', '#D97706', '#DC2626', '#0EA5E9', '#8B5CF6'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-government">
          <p className="font-body font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-caption" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.includes('Rate') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderTrendsChart = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-heading font-semibold text-foreground mb-2">
          Monthly Grievance Trends
        </h4>
        <p className="text-sm font-body text-muted-foreground">
          Track grievance filing and resolution patterns over the last 12 months
        </p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748B"
              fontSize={12}
              fontFamily="Source Sans Pro"
            />
            <YAxis 
              stroke="#64748B"
              fontSize={12}
              fontFamily="JetBrains Mono"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="filed" 
              stroke={colorScheme?.primary || '#0EA5E9'}
              strokeWidth={3}
              name="Filed"
              dot={{ fill: colorScheme?.primary || '#0EA5E9', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              stroke={colorScheme?.accent || '#059669'}
              strokeWidth={3}
              name="Resolved"
              dot={{ fill: colorScheme?.accent || '#059669', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderDepartmentChart = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-heading font-semibold text-foreground mb-2">
          Department Performance Comparison
        </h4>
        <p className="text-sm font-body text-muted-foreground">
          Resolution rates across top performing departments
        </p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.departmentComparison} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="name" 
              stroke="#64748B"
              fontSize={12}
              fontFamily="Source Sans Pro"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#64748B"
              fontSize={12}
              fontFamily="JetBrains Mono"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="resolutionRate" 
              name="Resolution Rate"
              radius={[4, 4, 0, 0]}
            >
              {chartData.departmentComparison.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderResolutionChart = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-heading font-semibold text-foreground mb-2">
          Resolution Status Distribution
        </h4>
        <p className="text-sm font-body text-muted-foreground">
          Current breakdown of all grievances by status
        </p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData.resolutionDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.resolutionDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {chartData.resolutionDistribution.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <div>
              <p className="text-sm font-body font-medium text-foreground">{item.name}</p>
              <p className="text-xs font-mono text-muted-foreground">{item.value.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActiveChart = () => {
    switch (activeChart) {
      case 'trends':
        return renderTrendsChart();
      case 'departments':
        return renderDepartmentChart();
      case 'resolution':
        return renderResolutionChart();
      default:
        return renderTrendsChart();
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground mb-2">
          Performance Analytics
        </h3>
        <p className="text-muted-foreground font-body">
          Visual insights into {stateName}'s grievance resolution patterns and trends
        </p>
      </div>

      {/* Chart Type Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {chartTypes.map((chart) => (
            <Button
              key={chart.id}
              variant={activeChart === chart.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveChart(chart.id)}
              iconName={chart.icon}
              iconPosition="left"
              iconSize={16}
            >
              {chart.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-government">
        {renderActiveChart()}
      </div>

      {/* Chart Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={20} className="text-green-600" />
            <h4 className="font-body font-semibold text-green-800">Best Performing</h4>
          </div>
          <p className="text-sm font-body text-green-700">
            {chartData.insights.bestDepartment} leads with {chartData.insights.bestRate}% resolution rate
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={20} className="text-blue-600" />
            <h4 className="font-body font-semibold text-blue-800">Fastest Resolution</h4>
          </div>
          <p className="text-sm font-body text-blue-700">
            Average resolution time: {chartData.insights.avgResolutionTime} days
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={20} className="text-yellow-600" />
            <h4 className="font-body font-semibold text-yellow-800">Needs Attention</h4>
          </div>
          <p className="text-sm font-body text-yellow-700">
            {chartData.insights.needsAttention} departments below 60% resolution rate
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;