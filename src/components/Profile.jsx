import { useEffect, useState } from 'react';
import { authAPI } from '../api';
import LogoutButton from './common/LogoutButton';
import { useAuth } from '../context/useAuth';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, token, logout, loading: authLoading } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      setMessage('');
      setLoading(true);
      try {
        const data = await authAPI.getProfile(token);
        if (data.error) {
          setMessage(`Error: ${data.error}`);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        
        // Provide more specific error messages
        if (err.message.includes('401')) {
          setMessage('Authentication failed. Please log in again.');
          // Optionally trigger logout
          setTimeout(() => logout(), 3000);
        } else if (err.message.includes('404')) {
          setMessage('Profile not found.');
        } else if (err.message.includes('Network')) {
          setMessage('Network error. Please check your connection.');
        } else {
          setMessage(`Failed to fetch profile: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
    
    if (token) {
      fetchProfile();
    }
  }, [token, logout]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h2 className="profile-title">Profile</h2>
          <LogoutButton onLogout={logout} />
        </div>
        <div className="error-message" style={{ color: '#e74c3c', padding: '10px', margin: '10px 0', border: '1px solid #e74c3c', borderRadius: '4px' }}>
          {message}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
        >
          Retry
        </button>
        <button 
          onClick={() => logout()} 
          style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    );
  }

  if (!profile) {
    return <p className="profile-message">No profile data available.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="profile-title">Profile</h2>
        <LogoutButton onLogout={logout} />
      </div>
      <p className="profile-item"><strong>Email:</strong> {profile.email}</p>
      <p className="profile-item"><strong>First Name:</strong> {profile.firstName}</p>
      <p className="profile-item"><strong>Last Name:</strong> {profile.lastName}</p>
      {profile.businessName && <p className="profile-item"><strong>Business Name:</strong> {profile.businessName}</p>}
      <p className="profile-item"><strong>Role:</strong> {profile.role || 'user'}</p>
    </div>
  );
}
