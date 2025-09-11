import React, { useState, useEffect } from 'react';
import { Heart, Activity, Thermometer, Droplets, Zap, Gauge } from 'lucide-react';

export function VitalSigns() {
  const [realTimeData, setRealTimeData] = useState({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 98.6,
    oxygenSaturation: 98,
    respiratoryRate: 16,
    bloodGlucose: 95
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        heartRate: prev.heartRate + (Math.random() - 0.5) * 4,
        bloodPressure: {
          systolic: prev.bloodPressure.systolic + (Math.random() - 0.5) * 6,
          diastolic: prev.bloodPressure.diastolic + (Math.random() - 0.5) * 4
        },
        temperature: prev.temperature + (Math.random() - 0.5) * 0.4,
        oxygenSaturation: Math.max(95, Math.min(100, prev.oxygenSaturation + (Math.random() - 0.5) * 2)),
        respiratoryRate: prev.respiratoryRate + (Math.random() - 0.5) * 2,
        bloodGlucose: prev.bloodGlucose + (Math.random() - 0.5) * 8
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const vitals = [
    {
      name: 'Heart Rate',
      value: Math.round(realTimeData.heartRate),
      unit: 'BPM',
      icon: Heart,
      normal: [60, 100],
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Blood Pressure',
      value: `${Math.round(realTimeData.bloodPressure.systolic)}/${Math.round(realTimeData.bloodPressure.diastolic)}`,
      unit: 'mmHg',
      icon: Activity,
      normal: [90, 140],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Temperature',
      value: realTimeData.temperature.toFixed(1),
      unit: '°F',
      icon: Thermometer,
      normal: [97.8, 99.1],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Oxygen Saturation',
      value: Math.round(realTimeData.oxygenSaturation),
      unit: '%',
      icon: Droplets,
      normal: [95, 100],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Respiratory Rate',
      value: Math.round(realTimeData.respiratoryRate),
      unit: '/min',
      icon: Zap,
      normal: [12, 20],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Blood Glucose',
      value: Math.round(realTimeData.bloodGlucose),
      unit: 'mg/dL',
      icon: Gauge,
      normal: [70, 140],
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vital Signs Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time physiological data from connected sensors</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600">Live Data Stream</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vitals.map((vital, index) => {
          const Icon = vital.icon;
          const isNormal = typeof vital.value === 'number' 
            ? vital.value >= vital.normal[0] && vital.value <= vital.normal[1]
            : true;
          
          return (
            <div key={index} className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-lg transition-all duration-300 ${
              isNormal ? 'border-green-200 hover:border-green-300' : 'border-amber-200 hover:border-amber-300'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${vital.bgColor}`}>
                  <Icon className={`w-6 h-6 ${vital.color}`} />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isNormal ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {isNormal ? 'NORMAL' : 'MONITOR'}
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">{vital.name}</h3>
              <div className="flex items-baseline space-x-2 mb-3">
                <span className="text-3xl font-bold text-gray-900">{vital.value}</span>
                <span className="text-sm text-gray-500">{vital.unit}</span>
              </div>
              
              <div className="text-xs text-gray-500">
                Normal range: {vital.normal[0]}-{vital.normal[1]} {vital.unit}
              </div>
              
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    isNormal ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                  style={{ 
                    width: isNormal ? '75%' : '45%',
                    animation: 'pulse 2s infinite'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Heart Rate Monitor', 'Blood Pressure Cuff', 'Temperature Sensor', 'Pulse Oximeter'].map((sensor, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900">{sensor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}