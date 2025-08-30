import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Building, MessageSquare, Star, CreditCard, AlertTriangle, Shield, BarChart3, Settings, LogOut } from 'lucide-react';

const Navigation = ({ onLogout }) => {
  const location = useLocation();

  const navigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin' },
    { key: 'agents', label: 'Agents', icon: Users, path: '/admin/agents' },
    { key: 'listings', label: 'Listings', icon: Building, path: '/admin/listings' },
    { key: 'leads', label: 'Leads', icon: MessageSquare, path: '/admin/leads' },
    { key: 'reviews', label: 'Reviews', icon: Star, path: '/admin/reviews' },
    { key: 'payments', label: 'Payments', icon: CreditCard, path: '/admin/payments' },
    { key: 'reports', label: 'Reports', icon: AlertTriangle, path: '/admin/reports' },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-slate-900 text-white w-64 min-h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">HomeSphere</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
