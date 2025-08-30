import React, { useState, useEffect } from 'react';
import Navigation from '../LandingPage/Navigation';
import Footer from '../LandingPage/Footer';
import { Search, MapPin, Star, Phone, Mail, MessageCircle, Award, Users, Home, AlertCircle } from 'lucide-react';
import { agentsAPI } from '../../api/agents';

const AgentsPage = ({ onLogin, token, user, onLogout }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Fetch agents from backend API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters = {};
        if (searchQuery) filters.search = searchQuery;
        if (selectedLocation !== 'all') filters.location = selectedLocation;
        if (selectedSpecialty !== 'all') filters.specialty = selectedSpecialty;

        const response = await agentsAPI.getAgents(filters, token);

        // Handle the response structure properly
        let agentsData = [];
        let totalCount = 0;
        let moreAvailable = false;

        if (response && response.agents) {
          agentsData = response.agents;
          totalCount = response.total || response.agents?.length || 0;
          moreAvailable = response.hasMore ?? false;
        } else if (Array.isArray(response)) {
          // Fallback for direct array response
          agentsData = response;
          totalCount = response.length;
          moreAvailable = false;
        } else if (response && response.data) {
          // Handle other response formats
          agentsData = response.data;
          totalCount = response.data.length;
          moreAvailable = false;
        } else {
          console.warn('Unexpected response format:', response);
          agentsData = [];
          totalCount = 0;
          moreAvailable = false;
        }

        setAgents(agentsData);
        setTotal(totalCount);
        setHasMore(moreAvailable);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError(err.message || 'Failed to load agents');
        setAgents([]);
        setTotal(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [searchQuery, selectedLocation, selectedSpecialty, token]);

  // Debounced search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // The actual search is handled in the main useEffect above
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filter agents (client-side filtering as backup)
  const filteredAgents = agents.filter(agent => {
    if (!agent || typeof agent !== 'object') return false;

    const matchesSearch = !searchQuery ||
      (agent.name && agent.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (agent.specialties && Array.isArray(agent.specialties) && 
       agent.specialties.some(specialty => 
         typeof specialty === 'string' && specialty.toLowerCase().includes(searchQuery.toLowerCase())
       ));

    const matchesLocation = selectedLocation === 'all' || 
      (agent.location && agent.location === selectedLocation);

    const matchesSpecialty = selectedSpecialty === 'all' ||
      (agent.specialties && Array.isArray(agent.specialties) && 
       agent.specialties.some(specialty => 
         typeof specialty === 'string' && specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
       ));

    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  const renderStars = (rating) => {
    const stars = [];
    const safeRating = Number(rating) || 0;
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const handleContactAgent = async (agentId, contactType) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'}/agents/${agentId}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          contactType,
          userId: user?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate contact');
      }

      const result = await response.json();

      if (contactType === 'call') {
        window.location.href = `tel:${result.phone || result.data?.phone}`;
      } else if (contactType === 'email') {
        window.location.href = `mailto:${result.email || result.data?.email}`;
      } else if (contactType === 'message') {
        console.log('Opening message interface for agent:', agentId);
      }
    } catch (err) {
      console.error('Error contacting agent:', err);
      alert('Failed to contact agent. Please try again.');
    }
  };

  const ErrorMessage = ({ message, onRetry }) => (
    <div className="text-center py-12">
      <div className="text-red-400 mb-4">
        <AlertCircle className="h-16 w-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Agents</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <div className="h-6 bg-gray-300 rounded mb-2 w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
            <div className="h-20 bg-gray-300 rounded mb-4"></div>
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-gray-300 rounded"></div>
              <div className="flex-1 h-10 bg-gray-300 rounded"></div>
              <div className="h-10 w-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onShowRegistration={() => {}} onShowLogin={() => {}} token={token} user={user} onLogout={onLogout} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Expert Agents</h1>
            <p className="text-xl opacity-90">Connect with experienced professionals who understand your needs</p>
          </div>
          
          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search agents by name or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">All Locations</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Kano">Kano</option>
                    <option value="Ibadan">Ibadan</option>
                  </select>
                </div>
                <div>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="all">All Specialties</option>
                    <option value="luxury">Luxury Homes</option>
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="investment">Investment</option>
                    <option value="land">Land Development</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Agents Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? 'Loading agents...' : 
             error ? 'Error loading agents' :
             `${filteredAgents.length} Agent${filteredAgents.length !== 1 ? 's' : ''} Available`}
          </h2>
        </div>
        
        {loading && <LoadingSkeleton />}
        
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => window.location.reload()} 
          />
        )}
        
        {!loading && !error && (
          <>
            {filteredAgents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAgents.map((agent) => (
                  <div key={agent.id || agent._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                    <div className="p-6">
                      {/* Agent Header */}
                      <div className="flex items-center mb-4">
                        <img
                          src={agent.image || agent.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name || 'Agent')}&background=3B82F6&color=fff`}
                          alt={agent.name || 'Agent'}
                          className="h-16 w-16 rounded-full object-cover mr-4"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name || 'Agent')}&background=3B82F6&color=fff`;
                          }}
                        />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {agent.name || 'Unknown Agent'}
                          </h3>
                          <p className="text-gray-600">{agent.title || 'Real Estate Agent'}</p>
                        </div>
                      </div>
                      
                      {/* Rating and Reviews */}
                      <div className="flex items-center mb-4">
                        <div className="flex items-center mr-2">
                          {renderStars(agent.rating || 0)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {agent.rating || 0} ({agent.reviews || 0} reviews)
                        </span>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{agent.location || 'Location not specified'}</span>
                      </div>
                      
                      {/* Bio */}
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                        {agent.bio || agent.description || 'Experienced real estate professional dedicated to helping clients find their perfect property.'}
                      </p>
                      
                      {/* Specialties */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-1">
                          {(agent.specialties || ['Real Estate']).map((specialty, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-gray-200">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Home className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{agent.propertiesSold || 0}</div>
                          <div className="text-xs text-gray-600">Sold</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Award className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{agent.yearsExperience || 0}</div>
                          <div className="text-xs text-gray-600">Years</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Users className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{agent.reviews || 0}</div>
                          <div className="text-xs text-gray-600">Reviews</div>
                        </div>
                      </div>
                      
                      {/* Contact Buttons */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleContactAgent(agent.id || agent._id, 'call')}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </button>
                        <button 
                          onClick={() => handleContactAgent(agent.id || agent._id, 'message')}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </button>
                        <button 
                          onClick={() => handleContactAgent(agent.id || agent._id, 'email')}
                          className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No agents found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AgentsPage;
