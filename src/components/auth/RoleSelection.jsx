import React from 'react';
import { User, Home, Shield } from 'lucide-react';

const RoleSelection = ({ onSelectRole }) => {
  const roles = [
    {
      id: 'user',
      title: 'Property Seeker',
      description: 'Looking to buy or rent properties',
      icon: User,
      color: 'bg-blue-500'
    },
    {
      id: 'agent',
      title: 'Real Estate Agent',
      description: 'List properties and connect with clients',
      icon: Home,
      color: 'bg-green-500'
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Manage the platform and users',
      icon: Shield,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Join HomeSphere</h2>
        <p className="text-lg text-gray-600">Select your role to get started</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
            >
              <div className={`${role.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
              <p className="text-gray-600">{role.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelection;
