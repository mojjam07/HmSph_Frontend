import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './AgentDashboard/Sidebar';
import Header from './AgentDashboard/Header';
import StatsCards from './AgentDashboard/StatsCards';
import ErrorAlert from './AgentDashboard/ErrorAlert';
import LoadingOverlay from './AgentDashboard/LoadingOverlay';
import PropertyForm from './AgentDashboard/PropertyForm';
import ApiService from '../api/ApiService';
import { AuthContext } from '../context/AuthContext';
import Dropdown from '../components/common/Dropdown';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize activeTab from localStorage if available, else default to 'properties'
    const storedTab = localStorage.getItem('agentDashboardActiveTab');
    const validTabs = ['properties', 'analytics', 'inquiries', 'profile', 'settings'];
    return storedTab && validTabs.includes(storedTab) ? storedTab : 'properties';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [agentData, setAgentData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userRole, setUserRole] = useState('agent');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' }
  ];

  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    address: '',
    area: '',
    state: 'Lagos',
    price: '',
    currency: '₦',
    bedrooms: '',
    bathrooms: '',
    size: '',
    images: [],
    features: [],
    status: 'pending'
  });

  const [analyticsData, setAnalyticsData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [inquiriesData, setInquiriesData] = useState([]);

  // Load initial data and user info
  useEffect(() => {
    if (user) {
      setAgentData(user);
      setUserRole(user.role || 'agent');
      loadAgentProperties();
    }
  }, [user]);

  const loadAgentProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get agent properties using ApiService
      const propertiesData = await ApiService.getProperties();
      setProperties(propertiesData.properties || propertiesData);
    } catch (err) {
      console.error('Failed to load properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadAgentAnalytics = async () => {
    try {
      const analytics = await ApiService.getDashboardAnalytics();
      return analytics;
    } catch (error) {
      console.error('Failed to load analytics:', error);
      return null;
    }
  };

  // Filter properties based on search and status
  useEffect(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort properties
    filtered.sort((a, b) => {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    });

    setFilteredProperties(filtered);
  }, [properties, searchQuery, statusFilter]);

  // Load analytics data when analytics tab is active
  useEffect(() => {
    if (activeTab === 'analytics' && !analyticsData) {
      loadAnalyticsData();
    }
  }, [activeTab, analyticsData]);

  // Load profile data when profile tab is active
  useEffect(() => {
    if (activeTab === 'profile' && !profileData) {
      loadProfileData();
    }
  }, [activeTab, profileData]);

  // Load inquiries data when inquiries tab is active
  useEffect(() => {
    if (activeTab === 'inquiries' && inquiriesData.length === 0) {
      loadInquiriesData();
    }
  }, [activeTab, inquiriesData]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const analytics = await loadAgentAnalytics();
      setAnalyticsData(analytics);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await ApiService.getAgentProfile();
      setProfileData(profile);
    } catch (err) {
      console.error('Failed to load profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadInquiriesData = async () => {
    setLoading(true);
    setError(null);
    try {
      // For now, we'll use a placeholder since there's no specific agent inquiries endpoint
      // In a real implementation, this would call: ApiService.getAgentInquiries()
      setInquiriesData([]);
    } catch (err) {
      console.error('Failed to load inquiries data:', err);
      setError('Failed to load inquiries data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAgentProperties();
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Persist activeTab to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('agentDashboardActiveTab', activeTab);
  }, [activeTab]);

  const handleAddProperty = async () => {
    setLoading(true);
    try {
      // Create property using ApiService
      const newProperty = await ApiService.createProperty(propertyForm);
      // Reload properties to get the updated list
      await loadAgentProperties();
      setShowAddProperty(false);
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Failed to add property:', err);
      setError(err.message || 'Failed to add property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setPropertyForm(property);
    setIsEditing(true);
    setShowAddProperty(true);
  };

  const handleUpdateProperty = async () => {
    setLoading(true);
    try {
      // Update property using ApiService
      await ApiService.updateProperty(selectedProperty.id, propertyForm);
      // Reload properties to get the updated list
      await loadAgentProperties();
      setShowAddProperty(false);
      setIsEditing(false);
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Failed to update property:', err);
      setError(err.message || 'Failed to update property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    setLoading(true);
    try {
      // Delete property using ApiService
      await ApiService.deleteProperty(id);
      // Reload properties to get the updated list
      await loadAgentProperties();
      setError(null);
    } catch (err) {
      console.error('Failed to delete property:', err);
      setError(err.message || 'Failed to delete property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPropertyForm({
      title: '',
      description: '',
      propertyType: 'apartment',
      address: '',
      area: '',
      state: 'Lagos',
      price: '',
      currency: '₦',
      bedrooms: '',
      bathrooms: '',
      size: '',
      images: [],
      features: [],
      status: 'pending'
    });
    setSelectedProperty(null);
  };

  const formatPrice = (amount) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onNavigateHome={handleNavigateHome} onLogout={handleLogout} />

      <div className="flex-1 ml-64">
        <Header
          activeTab={activeTab}
          loading={loading}
          agentData={agentData}
          handleRefresh={handleRefresh}
        />

        <main className="p-8">
          {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
          {loading && <LoadingOverlay />}

          <StatsCards agentData={agentData} properties={properties} />

          {activeTab === 'properties' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
                <button
                  onClick={() => setShowAddProperty(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add New Property
                </button>
              </div>

              <div className="mb-4 flex space-x-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <Dropdown
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="bg-white rounded-lg shadow-md p-4">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{property.address}</p>
                    <p className="text-blue-600 font-bold text-lg mb-2">
                      {formatPrice(property.price)}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      <span>{property.size}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        property.status === 'active' ? 'bg-green-100 text-green-800' :
                        property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleEditProperty(property)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
              {loading ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-600">Loading analytics data...</p>
                </div>
              ) : analyticsData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analyticsData.totalProperties || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Properties</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ₦{(analyticsData.totalValue || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      ₦{(analyticsData.averagePrice || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Average Price</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {analyticsData.properties?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Active Listings</div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-600">No analytics data available</p>
                </div>
              )}

              {analyticsData?.properties && analyticsData.properties.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Properties</h3>
                  <div className="space-y-3">
                    {analyticsData.properties.slice(0, 5).map((property) => (
                      <div key={property.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{property.title}</p>
                          <p className="text-sm text-gray-600">₦{property.price?.toLocaleString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Inquiries</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">Inquiries management coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="mt-1 text-sm text-gray-900">{agentData?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{agentData?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{agentData?.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">{agentData?.role || 'Agent'}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Properties</span>
                        <span className="text-sm font-medium text-gray-900">{properties.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Properties</span>
                        <span className="text-sm font-medium text-gray-900">
                          {properties.filter(p => p.status === 'active').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pending Properties</span>
                        <span className="text-sm font-medium text-gray-900">
                          {properties.filter(p => p.status === 'pending').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Member Since</span>
                        <span className="text-sm font-medium text-gray-900">
                          {agentData?.createdAt ? new Date(agentData.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">Settings page coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddProperty && (
        <PropertyForm
          propertyForm={propertyForm}
          setPropertyForm={setPropertyForm}
          isEditing={isEditing}
          setShowAddProperty={setShowAddProperty}
          setIsEditing={setIsEditing}
          resetForm={resetForm}
          selectedFiles={[]}
          setSelectedFiles={() => {}}
          uploadingImages={false}
          handleAddProperty={handleAddProperty}
          handleUpdateProperty={handleUpdateProperty}
        />
      )}
    </div>
  );
};

export default AgentDashboard;
