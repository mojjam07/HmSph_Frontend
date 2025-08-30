import React, { useState, useEffect } from 'react';
import { Users, Building, MessageSquare, DollarSign, Eye } from 'lucide-react';
import ApiService from '../../api/ApiService';

const Dashboard = ({ listings, agents }) => {
  const [dashboardStats, setDashboardStats] = useState({
    totalAgents: 0,
    activeListings: 0,
    newLeads: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load stats from admin API
      const statsResponse = await ApiService.getAdminDashboardStats();

      setDashboardStats({
        totalAgents: statsResponse.stats?.totalAgents || 0,
        activeListings: statsResponse.stats?.activeListings || 0,
        newLeads: 0, // Will be implemented when contacts API is ready
        revenue: statsResponse.stats?.totalRevenue || 0
      });
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={loadDashboardStats}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalAgents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeListings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Leads</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.newLeads}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₦{(dashboardStats.revenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900">Recent Listings</h3>
          </div>
          <div className="p-6 space-y-4">
            {listings.slice(0, 3).map((listing) => (
              <div key={listing.listingId} className="flex items-center space-x-4">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{listing.title}</p>
                  <p className="text-sm text-gray-500">₦{listing.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Eye className="h-4 w-4" />
                  <span>{listing.analytics.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900">Top Agents</h3>
          </div>
          <div className="p-6 space-y-4">
            {agents.map((agent) => (
              <div key={agent.agentId} className="flex items-center space-x-4">
                <img
                  src={agent.profilePicture}
                  alt={`${agent.firstName} ${agent.lastName}`}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {agent.firstName} {agent.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{agent.businessName}</p>
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    agent.verificationStatus === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {agent.verificationStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
