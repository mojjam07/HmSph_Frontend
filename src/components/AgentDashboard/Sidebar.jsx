import React from 'react';
import { Building, Home, BarChart3, Mail, Users, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => (
  <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-40">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Building className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-gray-900">HomeSphere</h1>
          <p className="text-xs text-gray-500">Agent Dashboard</p>
        </div>
      </div>
    </div>

    <nav className="mt-6">
      {[
        { id: 'properties', label: 'Properties', icon: Home },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'inquiries', label: 'Inquiries', icon: Mail },
        { id: 'profile', label: 'Profile', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings }
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
            activeTab === item.id 
              ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="absolute bottom-6 left-6 right-6">
      <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
        <LogOut className="h-5 w-5" />
        <span>Sign Out</span>
      </button>
    </div>
  </div>
);

export default Sidebar;
