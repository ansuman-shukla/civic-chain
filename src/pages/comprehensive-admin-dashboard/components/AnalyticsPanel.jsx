import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsPanel = ({ analyticsData }) => {
  const COLORS = ['#1E40AF', '#059669', '#D97706', '#DC2626'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-government">
          <p className="font-caption text-sm text-foreground">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Resolution Trends */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-government">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-foreground">Resolution Trends</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.resolutionTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#475569' }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#475569' }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="raised" 
                stroke="#1E40AF" 
                strokeWidth={2}
                dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm font-caption text-muted-foreground">Resolved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm font-caption text-muted-foreground">Raised</span>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-government">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Building" size={20} className="text-secondary" />
          <h3 className="text-lg font-heading font-semibold text-foreground">Department Performance</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="department" 
                tick={{ fontSize: 10, fill: '#475569' }}
                axisLine={{ stroke: '#E2E8F0' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#475569' }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="resolutionRate" fill="#1E40AF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-government">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="PieChart" size={20} className="text-accent" />
          <h3 className="text-lg font-heading font-semibold text-foreground">Status Distribution</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-government">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Activity" size={20} className="text-success" />
          <h3 className="text-lg font-heading font-semibold text-foreground">System Health</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-muted-foreground">Blockchain Sync</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-blockchain"></div>
              <span className="text-sm font-caption text-success">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-muted-foreground">API Response Time</span>
            <span className="text-sm font-caption text-foreground">245ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-muted-foreground">Database Status</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-caption text-success">Healthy</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-muted-foreground">Active Sessions</span>
            <span className="text-sm font-caption text-foreground">1,247</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-government">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Clock" size={20} className="text-warning" />
          <h3 className="text-lg font-heading font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {analyticsData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'resolved' ? 'bg-success text-success-foreground' :
                activity.type === 'raised' ? 'bg-primary text-primary-foreground' :
                'bg-warning text-warning-foreground'
              }`}>
                <Icon 
                  name={
                    activity.type === 'resolved' ? 'CheckCircle' :
                    activity.type === 'raised' ? 'Plus' : 'Clock'
                  } 
                  size={16} 
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-body text-foreground">{activity.description}</p>
                <p className="text-xs font-caption text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;