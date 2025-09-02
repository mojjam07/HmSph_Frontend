import React, { useState, useEffect } from 'react';
import { Plus, Eye, MessageSquare, Edit3, Heart, CheckCircle, XCircle, Filter } from 'lucide-react';
import ApiService from '../../api/ApiService';

const ListingsView = ({ listings, setSelectedListing }) => {
  const [listingsData, setListingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadListings();
  }, [statusFilter, searchQuery]);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ApiService.getAdminProperties({
        page: 1,
        limit: 50,
        status: statusFilter,
        search: searchQuery
      });

      if (!response || !response.properties) {
        throw new Error('Invalid response from server');
      }
      setListingsData(response.properties);
    } catch (err) {
      console.error('Failed to load listings:', err);
      setError('Failed to load listings data: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      await ApiService.approveProperty(propertyId);
      // Reload listings to reflect the change
      loadListings();
    } catch (err) {
      console.error('Failed to approve property:', err);
      setError('Failed to approve property');
    }
  };

  const handleReject = async (propertyId) => {
    try {
      await ApiService.rejectProperty(propertyId);
      // Reload listings to reflect the change
      loadListings();
    } catch (err) {
      console.error('Failed to reject property:', err);
      setError('Failed to reject property');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading listings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={loadListings}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Listings Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Listing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listingsData.map((listing) => (
          <div key={listing.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative">
              <img
                src={listing.images?.[0] || '/api/placeholder/400/300'}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4 space-x-2">
                {listing.isFeatured && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </span>
                )}
                {listing.isPromoted && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Promoted
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <button className="bg-white rounded-full p-2 shadow">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₦{listing.price?.toLocaleString() || 'N/A'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  listing.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {listing.status}
                </span>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                {listing.title}
              </h3>

              <div className="flex items-center text-gray-600 mb-4">
                <span className="mr-1">📍</span>
                <span className="text-sm">{listing.address || 'Address not available'}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{listing.bedrooms || 0} beds</span>
                <span>{listing.bathrooms || 0} baths</span>
                <span>{listing.size || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{listing.analytics?.views || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{listing.analytics?.inquiries || 0}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedListing(listing)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsView;
