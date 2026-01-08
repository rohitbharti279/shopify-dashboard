import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-navigate to welcome screen after 2.5 seconds
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-shopify-green to-green-700 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Logo/Icon */}
      <div className="relative z-10 mb-8">
        <div className="animate-bounce">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold text-shopify-green">S</span>
          </div>
        </div>
      </div>

      {/* App Name */}
      <h1 className="text-5xl font-bold mb-4 text-center animate-fade-in">Shopify Dashboard</h1>

      {/* Tagline */}
      <p className="text-xl text-white/80 mb-12 text-center max-w-md animate-fade-in" style={{ animationDelay: '0.5s' }}>
        Manage Your Store with Ease
      </p>

      {/* Loading indicator */}
      <div className="flex gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>

      {/* Additional text */}
      <p className="text-sm text-white/60 mt-16 animate-fade-in" style={{ animationDelay: '1.5s' }}>
        Starting up...
      </p>
    </div>
  );
}

export default Splash;
