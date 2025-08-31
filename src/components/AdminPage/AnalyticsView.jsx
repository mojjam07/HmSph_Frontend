import React, { useState, useEffect } from 'react';
import {
  BarChart3, PieChart, TrendingUp, TrendingDown,
  Users, Building, DollarSign, Activity,
  Calendar, Download, Filter, RefreshCw
} from 'lucide-react';

const AnalyticsView = ({ analytics }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  // Mock analytics data - in real app this would come from props
  const mockAnalytics = {
    userGrowth: {
      current: 1250,
      previous: 1100,
      change: 13.6,
      trend: 'up'
    },
    propertyViews: {
      current: 15420,
      previous: 14200,
      change: 8.6,
      trend: 'up'
    },
    revenue: {
      current: 285000,
      previous: 265000,
      change: 7.5,
      trend: 'up'
    },
    conversionRate: {
      current: 3.2,
      previous: 2.8,
      change: 14.3,
      trend: 'up'
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your platform performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(mockAnalytics).map(([key, data]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                {key === 'userGrowth' && <Users className="h-8 w-8 text-blue-600" />}
                {key === 'propertyViews' && <Building className="h-8 w-8 text-green-600" />}
                {key === 'revenue' && <DollarSign className="h-8 w-8 text-yellow-600" />}
                {key === 'conversionRate' && <TrendingUp className="h-8 w-8 text-purple-600" />}
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                data.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{data.change}%</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">
                {key === 'revenue'
                  ? `₦${(data.current / 1000).toFixed(0)}k`
                  : data.current.toLocaleString()
                }
              </p>
              <p className="text-sm text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Activity Trends</h3>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Daily</span>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Bar chart visualization</p>
              <p className="text-sm mt-1">User activity over time</p>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Sources</span>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <PieChart className="h-12 w-12 mx-auto mb-2" />
              <p>Pie chart visualization</p>
              <p className="text-sm mt-1">Traffic source breakdown</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
          <div className="space-y-3">
            {[
              { page: '/properties', views: 12543, change: '+12%' },
              { page: '/agents', views: 8921, change: '+8%' },
              { page: '/about', views: 6543, change: '+15%' },
              { page: '/contact', views: 4321, change: '+5%' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.page}</p>
                  <p className="text-sm text-gray-600">{item.views.toLocaleString()} views</p>
                </div>
                <span className="text-green-600 text-sm font-medium">{item.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          <div className="space-y-3">
            {[
              { device: 'Desktop', percentage: 65, color: 'bg-blue-500' },
              { device: 'Mobile', percentage: 30, color: 'bg-green-500' },
              { device: 'Tablet', percentage: 5, color: 'bg-yellow-500' }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{item.device}</span>
                  <span className="text-sm text-gray-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analytics Events</h3>
          <div className="space-y-3">
            {[
              { event: 'Peak traffic hour', time: '2 hours ago', type: 'info' },
              { event: 'New user milestone', time: '4 hours ago', type: 'success' },
              { event: 'High bounce rate alert', time: '6 hours ago', type: 'warning' },
              { event: 'Revenue target reached', time: '1 day ago', type: 'success' }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === 'success' ? 'bg-green-500' :
                  item.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.event}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
