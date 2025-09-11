import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface VitalCardProps {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  status: 'normal' | 'warning' | 'critical';
  trend: string;
}

export function VitalCard({ label, value, unit, icon: Icon, status, trend }: VitalCardProps) {
  const statusColors = {
    normal: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    critical: 'text-red-600 bg-red-50 border-red-200'
  };

  const trendColor = trend.startsWith('+') ? 'text-green-600' : trend.startsWith('-') ? 'text-red-600' : 'text-gray-600';

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-all duration-300 ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8" />
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          status === 'normal' ? 'bg-green-100 text-green-700' :
          status === 'warning' ? 'bg-amber-100 text-amber-700' :
          'bg-red-100 text-red-700'
        }`}>
          {status.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${trendColor}`}>{trend}</span>
          <span className="text-xs text-gray-500">vs last hour</span>
        </div>
      </div>
      
      <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            status === 'normal' ? 'bg-green-500' :
            status === 'warning' ? 'bg-amber-500' :
            'bg-red-500'
          }`}
          style={{ width: status === 'normal' ? '85%' : status === 'warning' ? '65%' : '35%' }}
        ></div>
      </div>
    </div>
  );
}
