import React from 'react';
import { RefreshCw, Bell } from 'lucide-react';

const Header = ({ activeTab, loading, agentData, handleRefresh }) => (
  <div className="ml-64 bg-white shadow-sm border-b border-gray-200 px-8 py-4">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
        <p className="text-gray-600">Manage your property listings</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <img 
            src={agentData?.avatar || '/api/placeholder/40/40'} 
            alt={agentData?.name || 'Agent'}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">{agentData?.name || 'Loading...'}</div>
            <div className="text-sm text-gray-500">Agent</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
