import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Calendar, Download, Filter } from 'lucide-react';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('vitals');

  const metrics = [
    { id: 'vitals', label: 'Vital Signs', value: '98.2%', trend: '+2.1%', color: 'text-blue-600' },
    { id: 'activity', label: 'Activity Level', value: '1,247', trend: '+15.3%', color: 'text-green-600' },
    { id: 'sleep', label: 'Sleep Quality', value: '8.2/10', trend: '-0.8%', color: 'text-purple-600' },
    { id: 'medication', label: 'Medication Adherence', value: '94.5%', trend: '+3.2%', color: 'text-amber-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive health data analysis and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${metric.color}`}>{metric.trend}</span>
                <span className="text-xs text-gray-500">vs previous period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vital Signs Trends</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Interactive trend charts</p>
              <p className="text-sm text-gray-500">Heart rate, BP, temperature over time</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Health Distribution</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-gray-600">Health status breakdown</p>
              <p className="text-sm text-gray-500">Normal, monitoring, alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Health Report</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="vitals">Vital Signs</option>
              <option value="activity">Physical Activity</option>
              <option value="sleep">Sleep Patterns</option>
              <option value="medication">Medication</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Key Insights</h4>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800">Improved heart rate variability</p>
                <p className="text-xs text-green-600">+12% over last week</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Consistent sleep schedule</p>
                <p className="text-xs text-blue-600">7.5 hours average</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-amber-800">Monitor blood pressure</p>
                <p className="text-xs text-amber-600">Slight elevation noted</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-medium text-gray-900 mb-4">Trend Analysis</h4>
            <div className="h-48 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">Advanced analytics visualization</p>
                <p className="text-sm text-gray-500">AI-powered health pattern recognition</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}