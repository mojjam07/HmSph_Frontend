import React from 'react';
import { Building, Home, TrendingUp, DollarSign } from 'lucide-react';

const StatsCards = ({ agentData, properties }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[
      { 
        label: 'Total Properties', 
        value: agentData?.totalProperties || properties.length, 
        icon: Building, 
        color: 'blue',
        change: '+12%'
      },
      { 
        label: 'Active Listings', 
        value: agentData?.activeListing || properties.filter(p => p.status === 'active').length, 
        icon: Home, 
        color: 'green',
        change: '+8%'
      },
      { 
        label: 'Properties Sold', 
        value: agentData?.sold || properties.filter(p => p.status === 'sold').length, 
        icon: TrendingUp, 
        color: 'purple',
        change: '+23%'
      },
      { 
        label: 'Total Revenue', 
        value: agentData?.revenue || '₦0', 
        icon: DollarSign, 
        color: 'yellow',
        change: '+15%'
      }
    ].map((stat, index) => (
      <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
            <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
          </div>
          <span className="text-green-600 text-sm font-medium">{stat.change}</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
        <div className="text-gray-600 text-sm">{stat.label}</div>
      </div>
    ))}
  </div>
);

export default StatsCards;
