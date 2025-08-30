import React, { useEffect, useState } from 'react';
import Navigation from './LandingPage/Navigation';
import HeroSection from './LandingPage/HeroSection';
import FeaturesSection from './LandingPage/FeaturesSection';
import Footer from './LandingPage/Footer';
import PropertiesSection from './LandingPage/PropertiesSection';
import CTASection from './LandingPage/CTASection';
import NewsletterSection from './LandingPage/NewsletterSection';
import RegistrationForm from './auth/RegistrationForm';
import Login from './auth/Login';
import { useAuth } from '../context/useAuth';

const LandingPage = ({ token, user, initialFilters = { priceRange: 'all', propertyType: 'all', searchQuery: '' } }) => {
  const { user: authUser, token: authToken, logout } = useAuth();
  const effectiveUser = user || authUser;
  const effectiveToken = token || authToken;

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '');
  const [selectedPropertyType, setSelectedPropertyType] = useState(initialFilters.propertyType || 'all');
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange || 'all');
  const [favorites, setFavorites] = useState(new Set());
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Sample data for demo - replace with your API call
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings');
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        setListings(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching listings');
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const toggleFavorite = (listingId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(listingId)) {
        newFavorites.delete(listingId);
      } else {
        newFavorites.add(listingId);
      }
      return newFavorites;
    });
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const onLogin = () => {
    setShowLogin(false);
    // You might want to refresh the page or update user state here
  };

  // Filter listings based on search criteria
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          listing.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPropertyType = selectedPropertyType === 'all' || listing.propertyType === selectedPropertyType;
    
    let matchesPriceRange = true;
    if (priceRange === 'under50') {
      matchesPriceRange = listing.price.amount < 50000000;
    } else if (priceRange === '50to100') {
      matchesPriceRange = listing.price.amount >= 50000000 && listing.price.amount <= 100000000;
    } else if (priceRange === 'over100') {
      matchesPriceRange = listing.price.amount > 100000000;
    }
    
    return matchesSearch && matchesPropertyType && matchesPriceRange;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation onShowRegistration={() => setShowRegistration(true)} onShowLogin={() => setShowLogin(true)} token={effectiveToken} user={effectiveUser} onLogout={logout} />
      
      <HeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
      />
      
      <FeaturesSection />
      
      <PropertiesSection 
        filteredListings={filteredListings}
        loading={loading}
        error={error}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        token={token}
      />
      
      <CTASection />
      
      <NewsletterSection />
      
      <Footer />
      
      {/* Registration Form Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-4 flex justify-end">
              <button 
                onClick={handleCloseRegistration}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-4 md:p-8">
              <RegistrationForm />
            </div>
          </div>
        </div>
      )}
      
      {/* Login Form Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-4 flex justify-end">
              <button 
                onClick={handleCloseLogin}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-4 md:p-8">
              <Login onLogin={onLogin} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
