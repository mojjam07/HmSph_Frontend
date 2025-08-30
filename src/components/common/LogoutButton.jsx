import React from 'react';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ onLogout, className = "" }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 ${className}`}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </button>
  );
};

export default LogoutButton;
