import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building, Menu, X, LogOut, User, Settings
} from 'lucide-react';

const Navigation = ({ 
  onShowRegistration, 
  onShowLogin, 
  token, 
  user, 
  onLogout 
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  
  const handleLoginClick = () => {
    if (token && user) {
      // User is already logged in, redirect to respective dashboard
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'agent') {
        navigate('/agent');
      } else {
        navigate('/profile');
      }
    } else {
      // User is not logged in, show login modal
      onShowLogin();
    }
  };

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/properties', label: 'Properties' },
    { path: '/agents', label: 'Agents' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  // Add role-specific navigation items
  const roleNavigationItems = [];
  if (token && user) {
    if (user.role === 'ADMIN') {
      roleNavigationItems.push({ path: '/admin', label: 'Dashboard' });
    } else if (user.role === 'AGENT') {
      roleNavigationItems.push({ path: '/agent', label: 'Dashboard' });
    }
  }

  const finalNavigationItems = [...navigationItems, ...roleNavigationItems];

  const isActivePage = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">HomeSphere</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Premium Properties</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {finalNavigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors ${
                  isActivePage(item.path)
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {token && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-2"
                >
                  <User className="h-5 w-5" />
                  <span>Hi, {user.firstName || user.name || 'User'}</span>
                </button>
                
                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigate to settings (you can implement this route)
                        console.log('Navigate to settings');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        console.log('Logout button clicked');
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {finalNavigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setShowMobileMenu(false)}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  isActivePage(item.path)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
              {token && user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Signed in as {user.firstName || user.name || 'User'}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </Link>
                  <button 
                    onClick={() => {
                      setShowMobileMenu(false);
                      onLogout();
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setShowMobileMenu(false)}
                    className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;