import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Welcome() {
  const navigate = useNavigate();
  const { continueAsGuest } = useAuth();

  const handleContinueAsGuest = () => {
    continueAsGuest();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-shopify-light to-white flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-shopify-green opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-shopify-green opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-shopify-green rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">S</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to Shopify Dashboard</h1>

        {/* Tagline */}
        <p className="text-lg text-gray-600 mb-4">
          Streamline Your Store Management
        </p>

        {/* Description */}
        <p className="text-gray-500 mb-12 leading-relaxed">
          Manage your products, orders, and analytics in one powerful platform. 
          Get insights, track inventory, and grow your business.
        </p>

        {/* Feature highlights */}
        <div className="space-y-3 mb-12 text-left">
          <div className="flex items-start gap-3">
            <span className="text-shopify-green text-xl font-bold mt-1">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Manage Products</p>
              <p className="text-sm text-gray-500">Add, edit, and organize your product catalog</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-shopify-green text-xl font-bold mt-1">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Track Orders</p>
              <p className="text-sm text-gray-500">Monitor and manage customer orders seamlessly</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-shopify-green text-xl font-bold mt-1">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Analyze Sales</p>
              <p className="text-sm text-gray-500">View real-time analytics and insights</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {/* Continue as Guest Button */}
          <button
            onClick={handleContinueAsGuest}
            className="w-full px-6 py-3 bg-shopify-green hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-shopify-green focus:ring-offset-2"
            aria-label="Continue as guest user"
          >
            Continue as Guest
          </button>

          {/* Login Button */}
          <button
            onClick={() => navigate('/login')}
            className="w-full px-6 py-3 bg-white border-2 border-shopify-green text-shopify-green font-semibold rounded-lg hover:bg-green-50 transition duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-shopify-green focus:ring-offset-2"
            aria-label="Login to your account"
          >
            Login
          </button>

          {/* Register Button */}
          <button
            onClick={() => navigate('/register')}
            className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Create a new account"
          >
            Register
          </button>
        </div>

        {/* Footer text */}
        <p className="text-xs text-gray-400 mt-8">
          © 2026 Shopify Dashboard. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Welcome;
