// 2. Custom Hook for Properties Data (usePropertiesData.js)
import { useState, useEffect, useCallback } from 'react';
import PropertiesAPI from '../../api/properties';

export const usePropertiesData = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch properties from backend
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        propertyType: selectedPropertyType !== 'all' ? selectedPropertyType : null,
        priceRange: priceRange !== 'all' ? priceRange : null,
        sortBy,
        search: searchQuery || null,
      };

      let response;
      if (searchQuery.trim()) {
        response = await PropertiesAPI.searchProperties(searchQuery, filters);
      } else {
        response = await PropertiesAPI.getProperties(filters);
      }

      setListings(response.data || response.properties || []);
      setTotalCount(response.total || response.count || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedPropertyType, priceRange, sortBy]);

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    try {
      const response = await PropertiesAPI.getFavorites();
      const favoriteIds = response.data || response.favorites || [];
      setFavorites(new Set(favoriteIds.map(fav => fav.propertyId || fav.id)));
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
      // Don't show error for favorites, just log it
    }
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback(async (propertyId) => {
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
        await PropertiesAPI.removeFromFavorites(propertyId);
      } else {
        await PropertiesAPI.addToFavorites(propertyId);
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
      
      console.error('Failed to update favorites:', err);
      // You might want to show a toast notification here
    }
  }, [favorites]);

  // Retry function
  const retry = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Fetch data when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProperties();
    }, searchQuery ? 500 : 0); // Debounce search queries

    return () => clearTimeout(debounceTimer);
  }, [fetchProperties]);

  // Fetch favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    listings,
    loading,
    error,
    favorites,
    totalCount,
    searchQuery,
    setSearchQuery,
    selectedPropertyType,
    setSelectedPropertyType,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    toggleFavorite,
    retry,
    refetch: fetchProperties,
  };
};
