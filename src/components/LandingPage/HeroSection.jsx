import React from 'react';
import { Search, Building, Users, TrendingUp, Shield } from 'lucide-react';

const HeroSection = ({ searchQuery, setSearchQuery, selectedPropertyType, setSelectedPropertyType }) => {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div 
        className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/api/placeholder/1200/800")',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Discover premium properties in Nigeria's most desirable locations. 
              Your next home is just a search away.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location, property type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <select
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Types</option>
                  <option value="house">Houses</option>
                  <option value="apartment">Apartments</option>
                  <option value="land">Land</option>
                </select>
                
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold shadow-lg">
                  Search
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {[
                { value: '2,847', label: 'Properties', icon: Building },
                { value: '1,200+', label: 'Happy Clients', icon: Users },
                { value: '98%', label: 'Success Rate', icon: TrendingUp },
                { value: '24/7', label: 'Support', icon: Shield }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
