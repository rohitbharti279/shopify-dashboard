import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Profile Page - Protected Route Example
 * Only accessible to authenticated users
 * Displays user information and account settings
 */
function Profile() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and settings</p>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Information</h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-shopify-green rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{user?.name || 'N/A'}</p>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded border border-gray-200">
                {user?.email || 'N/A'}
              </p>
            </div>

            {/* Login Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Login Time
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded border border-gray-200">
                {user?.loginTime
                  ? new Date(user.loginTime).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Authentication Token Card */}
        <div className="bg-blue-50 rounded-lg shadow-lg p-8 mb-6 border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Authentication Token</h2>
          <p className="text-blue-700 text-sm mb-4">
            Mock JWT token (for development only). Real tokens from backend will appear here.
          </p>

          <div className="space-y-4">
            <div className="relative">
              <div className="bg-white px-4 py-3 rounded border border-blue-300 font-mono text-xs text-gray-600 overflow-auto max-h-20">
                <span title={token || 'No token'} className="break-all">
                  {token || 'No active token'}
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyToken}
              disabled={!token}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {copied ? '✓ Copied!' : 'Copy Token'}
            </button>
          </div>
        </div>

        {/* Account Settings Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

          <div className="space-y-4">
            {/* Edit Profile Button */}
            <button className="w-full px-6 py-3 bg-shopify-green hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-shopify-green focus:ring-offset-2">
              Edit Profile
            </button>

            {/* Change Password Button */}
            <button className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
              Change Password
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-green-50 rounded-lg p-6 mt-6 border border-green-200">
          <p className="text-green-800 text-sm">
            <strong>Note:</strong> This is a protected route. You can only see this page because you're authenticated.
            The token shown above is a mock JWT token for development purposes. When connected to a real backend,
            you'll receive actual JWT tokens from your authentication server.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
