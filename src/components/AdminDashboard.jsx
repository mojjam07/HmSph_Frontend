import React, { useState, useEffect, useContext } from 'react';
import {
  User, Home, MessageSquare, Star, CreditCard, AlertTriangle,
  Shield, Search, Heart, Eye, Phone, Mail, MapPin, Calendar,
  DollarSign, Camera, Video, Settings, Bell, Filter, Plus,
  Edit3, Trash2, Check, X, Upload, Building, Users, TrendingUp,
  Activity, BarChart3, PieChart, Clock, CheckCircle, XCircle,
  AlertCircle, Download, FileText, Globe, Zap, Award
} from 'lucide-react';
import LogoutButton from './common/LogoutButton';
import ApiService from '../api/ApiService';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = ({ onLogout }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [agents, setAgents] = useState([]);
  const [listings, setListings] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalAgents: { value: 0, change: '+0%', trend: 'neutral' },
    activeListings: { value: 0, change: '+0%', trend: 'neutral' },
    newLeads: { value: 0, change: '+0%', trend: 'neutral' },
    revenue: { value: 0, change: '+0%', trend: 'neutral' },
    conversionRate: { value: 0, change: '+0%', trend: 'neutral' },
    avgResponseTime: { value: '0h', change: '+0%', trend: 'neutral' }
  });

  // Load data based on active view
  useEffect(() => {
    switch(activeView) {
      case 'dashboard':
        loadDashboardData();
        break;
      case 'agents':
        loadAgents();
        break;
      case 'listings':
        loadListings();
        break;
      case 'analytics':
        loadAnalytics();
        break;
      default:
        break;
    }
  }, [activeView]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load dashboard stats from admin API
      const dashboardStatsData = await ApiService.getAdminDashboardStats();

      setDashboardStats({
        totalAgents: {
          value: dashboardStatsData.stats?.totalAgents || 0,
          change: '+0%',
          trend: 'neutral'
        },
        activeListings: {
          value: dashboardStatsData.stats?.activeListings || 0,
          change: '+0%',
          trend: 'neutral'
        },
        newLeads: {
          value: 0, // Placeholder - would need leads API
          change: '+0%',
          trend: 'neutral'
        },
        revenue: {
          value: dashboardStatsData.stats?.totalRevenue || 0,
          change: '+0%',
          trend: 'neutral'
        },
        conversionRate: {
          value: 0, // Placeholder - would need conversion data
          change: '+0%',
          trend: 'neutral'
        },
        avgResponseTime: {
          value: '0h', // Placeholder
          change: '+0%',
          trend: 'neutral'
        }
      });

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadAgents = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      // Use admin agents API to get all agents
      const agentsData = await ApiService.getAdminAgents();
      setAgents(agentsData.agents || []);
      return agentsData.agents || [];
    } catch (err) {
      console.error('Failed to load agents:', err);
      setError('Failed to load agents');
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const loadListings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use properties API to get all listings
      const propertiesData = await ApiService.getProperties({ limit: 50 });
      const propertiesList = propertiesData.properties || propertiesData;

      // Transform properties to match the expected listing format
      const transformedListings = propertiesList.map((property, index) => ({
        listingId: property.id || `temp-${index}`,
        agentId: property.agentId || '1',
        title: property.title || 'Untitled Property',
        description: property.description || 'No description available',
        propertyType: property.propertyType?.toLowerCase() || 'house',
        location: {
          address: property.address || 'Address not specified',
          area: property.area || 'Area not specified'
        },
        price: property.price || 0,
        features: {
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          parking: property.parking || 0,
          size: property.size || '0 sqm'
        },
        status: 'active',
        isPromoted: Math.random() > 0.7,
        isFeatured: Math.random() > 0.8,
        images: property.images || ['/api/placeholder/300/200'],
        videos: [],
        analytics: {
          views: Math.floor(Math.random() * 500),
          inquiries: Math.floor(Math.random() * 50),
          favorites: Math.floor(Math.random() * 100)
        },
        createdAt: property.createdAt || new Date().toISOString()
      }));

      setListings(transformedListings);
    } catch (err) {
      console.error('Failed to load listings:', err);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load analytics data from admin API
      const analyticsData = await ApiService.getAdminAnalytics();
      console.log('Analytics data loaded:', analyticsData);
      // Analytics data would be used to populate charts and metrics
      // For now, we just log it since the UI components need to be updated
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Navigation with collapsible sidebar
  const Navigation = () => (
    <div className="flex">
      {/* Sidebar */}
      <div className={`bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } min-h-screen fixed left-0 top-0 z-40`}>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg">HomeSphere</h1>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-8">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
            { key: 'agents', label: 'Agents', icon: Users, badge: '2.8k' },
            { key: 'listings', label: 'Listings', icon: Building, badge: '15k' },
            { key: 'leads', label: 'Leads', icon: MessageSquare, badge: notifications },
            { key: 'reviews', label: 'Reviews', icon: Star, badge: null },
            { key: 'payments', label: 'Payments', icon: CreditCard, badge: null },
            { key: 'reports', label: 'Reports', icon: AlertTriangle, badge: null },
            { key: 'analytics', label: 'Analytics', icon: BarChart3, badge: null }
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-slate-700 transition-colors ${
                activeView === key ? 'bg-blue-600 border-r-4 border-blue-400' : ''
              }`}
            >
              <Icon className="h-5 w-5 mr-3 min-w-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="bg-red-500 text-xs px-2 py-1 rounded-full ml-2">
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5 mx-auto" />
          </button>
        </div>
      </div>

      {/* Top Navigation */}
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 capitalize">{activeView}</h2>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <span>Good morning, {user?.firstName || 'Admin'}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-3 border-l pl-4">
              <img
                src={user?.profilePicture || "/api/placeholder/32/32"}
                alt="Admin"
                className="h-8 w-8 rounded-full"
              />
              <div className="hidden md:block text-sm">
                <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-gray-500">{user?.role || 'Super Admin'}</p>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );

  // Enhanced Dashboard with better metrics and charts
  const Dashboard = () => (
    <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 p-6 bg-gray-50 min-h-screen`}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'Admin'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your platform today.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last login</p>
              <p className="text-sm font-medium text-gray-900">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today'}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {Object.entries(dashboardStats).map(([key, stat]) => (
            <div key={key} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {key === 'totalAgents' && <Users className="h-8 w-8 text-blue-600" />}
                  {key === 'activeListings' && <Building className="h-8 w-8 text-green-600" />}
                  {key === 'newLeads' && <MessageSquare className="h-8 w-8 text-purple-600" />}
                  {key === 'revenue' && <DollarSign className="h-8 w-8 text-yellow-600" />}
                  {key === 'conversionRate' && <TrendingUp className="h-8 w-8 text-indigo-600" />}
                  {key === 'avgResponseTime' && <Clock className="h-8 w-8 text-red-600" />}
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-4 w-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">
                  {typeof stat.value === 'number' && key === 'revenue'
                    ? `₦${(stat.value / 1000000).toFixed(1)}M`
                    : typeof stat.value === 'number' && stat.value > 1000
                    ? `${(stat.value / 1000).toFixed(1)}k`
                    : stat.value
                  }
                </p>
                <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View all</button>
            </div>
            <div className="space-y-4">
              {[
                { type: 'agent', message: 'New agent John Smith registered', time: '2 minutes ago', icon: Users },
                { type: 'listing', message: 'Premium listing activated in VI', time: '15 minutes ago', icon: Building },
                { type: 'payment', message: 'Payment of ₦50,000 received', time: '1 hour ago', icon: CreditCard },
                { type: 'review', message: 'New 5-star review submitted', time: '2 hours ago', icon: Star }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <activity.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions and Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'Add New Agent', icon: Plus, color: 'blue' },
                { label: 'Review Pending Listings', icon: Eye, color: 'green' },
                { label: 'Generate Report', icon: FileText, color: 'purple' },
                { label: 'Export Data', icon: Download, color: 'gray' }
              ].map((action, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 border-dashed border-${action.color}-200 hover:border-${action.color}-400 hover:bg-${action.color}-50 transition-all`}
                >
                  <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Listings</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View all</button>
            </div>
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.listingId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{listing.title}</h4>
                    <p className="text-sm text-gray-600">₦{listing.price.toLocaleString()}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {listing.analytics.views}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {listing.analytics.inquiries}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {listing.analytics.favorites}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {listing.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Featured</span>
                    )}
                    {listing.isPromoted && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Promoted</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render with routing
  const renderView = () => {
    switch(activeView) {
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main>
        {renderView()}
      </main>

      {/* Modals */}
      {selectedAgent && (
        <AgentModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}

      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
