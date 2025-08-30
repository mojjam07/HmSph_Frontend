// 2. Custom Hook for Properties Data (useProperties.js)
import { useState, useEffect, useCallback } from 'react';
import { propertiesAPI, favoritesAPI } from '../../api';

export const useProperties = (initialFilters = {}, token = null) => {
  const [properties, setProperties] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange || 'all');
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '');
  const [selectedPropertyType, setSelectedPropertyType] = useState(initialFilters.propertyType || 'all');

  // Fetch properties from backend
  const fetchProperties = useCallback(async (page = 1, append = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const filters = {
        priceRange: priceRange !== 'all' ? priceRange : null,
        propertyType: selectedPropertyType !== 'all' ? selectedPropertyType : null,
        search: searchQuery || null,
        page,
        limit: 12,
      };

      const response = await propertiesAPI.getProperties(filters);
      
      // Add defensive programming to handle undefined pagination
      if (!response) {
        throw new Error('No response received from server');
      }
      
      if (append) {
        setProperties(prev => [...prev, ...(response.data || [])]);
      } else {
        setProperties(response.data || []);
      }
      
      // Safely access pagination data with fallback
      const hasMoreData = response?.pagination?.hasMore ?? false;
      setHasMore(hasMoreData);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to fetch properties');
      
      // Reset hasMore on error to prevent infinite loading attempts
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [priceRange, selectedPropertyType, searchQuery]);

  // Load more properties
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchProperties(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, fetchProperties]);

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    // Only fetch favorites if user is authenticated
    if (!token) {
      setFavorites(new Set());
      return;
    }
    
    try {
      const response = await favoritesAPI.getFavorites();
      setFavorites(new Set(response.data.map(fav => fav.propertyId)));
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
      setFavorites(new Set()); // Reset favorites on error
    }
  }, [token]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (propertyId) => {
    // Only allow toggling favorites if user is authenticated
    if (!token) {
      setError('Please log in to save favorites');
      return;
    }
    
    const wasFavorite = favorites.has(propertyId);
    
    // Optimistic update
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (wasFavorite) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });

    try {
      if (wasFavorite) {
        await favoritesAPI.removeFromFavorites(propertyId);
      } else {
        await favoritesAPI.addToFavorites(propertyId);
      }
    } catch (err) {
      // Revert optimistic update on error
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (wasFavorite) {
          newFavorites.add(propertyId);
        } else {
          newFavorites.delete(propertyId);
        }
        return newFavorites;
      });
      
      setError('Failed to update favorites');
    }
  }, [favorites, token]);

  // Apply client-side filtering (if needed)
  useEffect(() => {
    setFilteredListings(properties);
  }, [properties]);

  // Fetch data on filter changes
  useEffect(() => {
    fetchProperties(1, false);
  }, [fetchProperties]);

  // Fetch favorites when token changes
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Retry function
  const retry = useCallback(() => {
    fetchProperties(1, false);
  }, [fetchProperties]);

  return {
    properties,
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
    refetch: () => fetchProperties(1, false),
  };
};
