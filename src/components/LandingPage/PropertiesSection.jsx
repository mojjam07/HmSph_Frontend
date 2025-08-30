import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { useProperties } from '../hook/useProperties';

const PropertiesSection = ({ initialFilters = {}, token = null }) => {
  const {
    filteredListings,
    loading,
    error,
    favorites,
    hasMore,
    priceRange,
    setPriceRange,
    searchQuery,
    setSearchQuery,
    selectedPropertyType,
    setSelectedPropertyType,
    toggleFavorite,
    loadMore,
    retry,
  } = useProperties(initialFilters, token);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedPropertyType('all');
    setPriceRange('all');
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600">Discover our handpicked premium listings</p>
          </div>
          
          {/* Enhanced Filters */}
          <div className="flex flex-wrap gap-4 mt-6 md:mt-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Property Type Filter */}
            <select
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="condo">Condo</option>
            </select>

            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Prices</option>
              <option value="under50">Under ₦50M</option>
              <option value="50to100">₦50M - ₦100M</option>
              <option value="over100">Over ₦100M</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && filteredListings.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl font-medium text-gray-600">Loading amazing properties...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !error.includes('Failed to fetch properties') && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-600 text-xl font-medium mb-2">Oops! Something went wrong</div>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={retry}
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
              {filteredListings.map((listing) => (
                <PropertyCard 
                  key={listing.listingId} 
                  listing={listing} 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredListings.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto mb-4" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all properties.</p>
                <button 
                  onClick={handleClearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View All Properties
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredListings.length > 0 && hasMore && (
              <div className="text-center">
                <button 
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </span>
                  ) : (
                    'Load More Properties'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PropertiesSection;