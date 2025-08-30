import React, { useState, useEffect } from 'react';
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

const AdminDashboard = ({ onLogout }) => {
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
              <span>Good morning, Admin</span>
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
                src="/api/placeholder/32/32" 
                alt="Admin" 
                className="h-8 w-8 rounded-full"
              />
              <div className="hidden md:block text-sm">
                <p className="font-medium text-gray-900">Admin User</p>
                <p className="text-gray-500">Super Admin</p>
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

  // Enhanced Agents View with better filters and cards
  const AgentsView = () => (
    <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 p-6 bg-gray-50 min-h-screen`}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agents Management</h2>
            <p className="text-gray-600">Manage and monitor all real estate agents</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </button>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Status</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Plans</option>
              <option>Premium</option>
              <option>Basic</option>
              <option>Free</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Sort by Join Date</option>
              <option>Sort by Performance</option>
              <option>Sort by Listings</option>
            </select>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.agentId} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <img 
                      src={agent.profilePicture} 
                      alt=""
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                      new Date(agent.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000) 
                        ? 'bg-green-500' 
                        : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {agent.firstName} {agent.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{agent.businessName}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            i < Math.floor(agent.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">{agent.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.verificationStatus === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agent.verificationStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Plan:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.subscriptionPlan === 'premium' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {agent.subscriptionPlan}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Listings:</span>
                    <span className="font-medium">{agent.currentMonthListings}/{agent.listingLimits}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-blue-600">{agent.totalSales}</p>
                    <p className="text-xs text-gray-600">Sales</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-green-600">{agent.currentMonthListings}</p>
                    <p className="text-xs text-gray-600">Active</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedAgent(agent)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Analytics View
  const AnalyticsView = () => (
    <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 p-6 bg-gray-50 min-h-screen`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-gray-600">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
            <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                <p>Revenue chart visualization</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance</h3>
            <div className="space-y-4">
              {[
                { label: 'Conversion Rate', value: '12.5%', change: '+2.3%', positive: true },
                { label: 'Avg. Response Time', value: '2.4h', change: '-15min', positive: true },
                { label: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', positive: true },
                { label: 'Market Share', value: '23.1%', change: '+1.8%', positive: true }
              ].map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                    <p className="text-lg font-bold text-gray-800">{metric.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${
                    metric.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Analytics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">User Activity</h4>
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-medium">Activity Chart</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Property Types</h4>
              <PieChart className="h-5 w-5 text-green-600" />
            </div>
            <div className="h-32 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-medium">Distribution</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Locations</h4>
              <Globe className="h-5 w-5 text-purple-600" />
            </div>
            <div className="h-32 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-medium">Map View</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Performance</h4>
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="h-32 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-medium">Rankings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Listings View with better card design
  const ListingsView = () => (
    <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 p-6 bg-gray-50 min-h-screen`}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Listings Management</h2>
            <p className="text-gray-600">Monitor and manage all property listings</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </button>
          </div>
        </div>

        {/* Enhanced listing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.listingId} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={listing.images[0]} 
                  alt={listing.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 space-x-2">
                  {listing.isFeatured && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      ⭐ Featured
                    </span>
                  )}
                  {listing.isPromoted && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      🚀 Promoted
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                    listing.status === 'active' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {listing.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ₦{(listing.price / 1000000).toFixed(1)}M
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {listing.propertyType}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {listing.title}
                </h3>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm">{listing.location.address}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                  <div className="text-center bg-gray-50 rounded-lg py-2">
                    <div className="font-semibold text-gray-900">{listing.features.bedrooms}</div>
                    <div className="text-xs">Bedrooms</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg py-2">
                    <div className="font-semibold text-gray-900">{listing.features.bathrooms}</div>
                    <div className="text-xs">Bathrooms</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg py-2">
                    <div className="font-semibold text-gray-900">{listing.features.size}</div>
                    <div className="text-xs">Size</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{listing.analytics.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{listing.analytics.inquiries}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{listing.analytics.favorites}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedListing(listing)}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

   // Enhanced Agent Modal with better design
  const AgentModal = ({ agent, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Agent Profile</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Agent Header */}
          <div className="flex items-start space-x-6">
            <div className="relative">
              <img 
                src={agent.profilePicture} 
                alt=""
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white shadow-lg ${
                new Date(agent.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000) 
                  ? 'bg-green-500' 
                  : 'bg-gray-400'
              }`}></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-2xl font-bold text-gray-900">
                  {agent.firstName} {agent.lastName}
                </h4>
                {agent.isVerified && (
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    <Shield className="h-4 w-4" />
                  </div>
                )}
              </div>
              <p className="text-lg text-gray-600 mb-2">{agent.businessName}</p>
              <p className="text-sm text-gray-500 mb-3">License: {agent.licenseNumber}</p>
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < Math.floor(agent.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">{agent.rating} rating</span>
              </div>
              <div className="flex space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  agent.verificationStatus === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {agent.verificationStatus}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  agent.subscriptionPlan === 'premium' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {agent.subscriptionPlan} plan
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{agent.totalSales}</div>
              <div className="text-sm text-gray-600">Total Sales</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{agent.currentMonthListings}</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{agent.listingLimits}</div>
              <div className="text-sm text-gray-600">Listing Limit</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round((agent.currentMonthListings / agent.listingLimits) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Usage Rate</div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h5 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h5>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium">{agent.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{agent.phone}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-lg font-semibold text-gray-900 mb-4">Activity</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Joined</span>
                    <span className="font-medium">{new Date(agent.joinedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Last Active</span>
                    <span className="font-medium">{new Date(agent.lastActive).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h5>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <p>Performance chart would go here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
              Suspend Agent
            </button>
            <button className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
              Edit Profile
            </button>
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
      case 'agents':
        return <AgentsView />;
      case 'listings':
        return <ListingsView />;
      case 'analytics':
        return <AnalyticsView />;
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