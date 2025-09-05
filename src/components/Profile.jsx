import { useEffect, useState, useCallback, useRef } from 'react';
import { authAPI } from '../api';
import LogoutButton from './common/LogoutButton';
import LoadingSpinner from './common/LoadingSpinner';
import { useAuth } from '../context/useAuth';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, token, logout, loading: authLoading } = useAuth();
  const isMounted = useRef(true);

  const fetchProfile = useCallback(async () => {
    setMessage('');
    setLoading(true);
    try {
      const data = await authAPI.getProfile(token);
      if (!isMounted.current) return;
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setProfile(data);
      }
    } catch (err) {
      if (!isMounted.current) return;
      console.error('Profile fetch error:', err);

      if (err.message.includes('401')) {
        setMessage('Authentication failed. Please log in again.');
        setTimeout(() => logout(), 3000);
      } else if (err.message.includes('404')) {
        setMessage('Profile not found.');
      } else if (err.message.includes('Network')) {
        setMessage('Network error. Please check your connection.');
      } else {
        setMessage(`Failed to fetch profile: ${err.message}`);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    isMounted.current = true;
    if (token) {
      fetchProfile();
    }
    return () => {
      isMounted.current = false;
    };
  }, [token, fetchProfile]);

  if (authLoading) {
    return <LoadingSpinner size="lg" message="Loading profile..." />;
  }

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading profile..." />;
  }

  if (message) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <LogoutButton onLogout={logout} />
        </div>
        <div
          className="text-red-600 p-3 mb-4 border border-red-600 rounded"
          role="alert"
          aria-live="assertive"
        >
          {message}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <p className="max-w-md mx-auto mt-10 text-center text-gray-600">
        No profile data available.
      </p>
    );
  }

  const profileUser = profile.user;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <LogoutButton onLogout={logout} />
      </div>
      <div className="space-y-3">
        <p className="text-gray-700"><strong>Email:</strong> {profileUser.email}</p>
        <p className="text-gray-700"><strong>First Name:</strong> {profileUser.firstName}</p>
        <p className="text-gray-700"><strong>Last Name:</strong> {profileUser.lastName}</p>
        {profileUser.businessName && (
          <p className="text-gray-700"><strong>Business Name:</strong> {profileUser.businessName}</p>
        )}
        <p className="text-gray-700"><strong>Role:</strong> {profileUser.role || 'user'}</p>
      </div>
    </div>
  );
}
