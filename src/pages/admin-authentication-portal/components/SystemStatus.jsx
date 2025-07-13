import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = () => {
  const [systemStats, setSystemStats] = useState({
    uptime: '99.9%',
    activeAdmins: 2,
    lastUpdate: new Date(),
    serverLoad: 'Normal'
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const statusItems = [
    {
      icon: "Activity",
      label: "System Uptime",
      value: systemStats.uptime,
      status: "good"
    },
    {
      icon: "Users",
      label: "Active Admins",
      value: systemStats.activeAdmins.toString(),
      status: "good"
    },
    {
      icon: "Server",
      label: "Server Load",
      value: systemStats.serverLoad,
      status: "good"
    },
    {
      icon: "Clock",
      label: "Server Time",
      value: currentTime.toLocaleTimeString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        hour12: true 
      }),
      status: "good"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'good': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-muted border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          System Status
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse-blockchain"></div>
          <span className="text-sm font-caption text-success">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statusItems.map((item, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border ${getStatusBg(item.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={item.icon} 
                  size={20} 
                  className={getStatusColor(item.status)} 
                />
                <div>
                  <p className="text-sm font-body font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className={`text-lg font-heading font-semibold ${getStatusColor(item.status)}`}>
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs font-caption text-muted-foreground">
          <span>Last system check: {systemStats.lastUpdate.toLocaleString('en-IN')}</span>
          <span>IST (UTC+5:30)</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;