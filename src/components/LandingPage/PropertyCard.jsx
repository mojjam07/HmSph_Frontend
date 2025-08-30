import React from 'react';
import { MapPin, Bed, Bath, Square, Heart, Eye, Star, Phone, Mail } from 'lucide-react';

const PropertyCard = ({ listing, favorites, toggleFavorite }) => {
  const formatPrice = (amount) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative">
        <img 
          src={listing.images[0]} 
          alt={listing.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-4 left-4 space-x-2">
          {listing.isFeatured && (
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ Featured
            </span>
          )}
          {listing.isNew && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              🆕 New
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => toggleFavorite(listing.listingId)}
            className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-all ${
              favorites.has(listing.listingId) 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className="h-4 w-4" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-all">
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full">
            <span className="text-lg font-bold">{formatPrice(listing.price.amount)}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm">{listing.location.address}</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center bg-gray-50 rounded-lg py-3 px-2">
            <Bed className="h-5 w-5 mx-auto mb-1 text-gray-400" />
            <div className="text-sm font-semibold text-gray-900">{listing.features.bedrooms}</div>
            <div className="text-xs text-gray-500">Beds</div>
          </div>
          <div className="text-center bg-gray-50 rounded-lg py-3 px-2">
            <Bath className="h-5 w-5 mx-auto mb-1 text-gray-400" />
            <div className="text-sm font-semibold text-gray-900">{listing.features.bathrooms}</div>
            <div className="text-xs text-gray-500">Baths</div>
          </div>
          <div className="text-center bg-gray-50 rounded-lg py-3 px-2">
            <Square className="h-5 w-5 mx-auto mb-1 text-gray-400" />
            <div className="text-sm font-semibold text-gray-900">{listing.features.size}</div>
            <div className="text-xs text-gray-500">Size</div>
          </div>
        </div>

        {/* Agent & Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <img 
              src="/api/placeholder/40/40" 
              alt={listing.agent.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">{listing.agent.name}</div>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">{listing.agent.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{listing.analytics.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>{listing.analytics.favorites}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold transform hover:scale-105 duration-200">
            View Details
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Phone className="h-4 w-4" />
              <span className="text-sm">Call</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Mail className="h-4 w-4" />
              <span className="text-sm">Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
