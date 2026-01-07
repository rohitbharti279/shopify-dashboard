import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();
  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/products', label: 'Products' },
    { to: '/orders', label: 'Orders' },
    { to: '/analytics', label: 'Analytics' },
  ];
  return (
    <div className="min-h-screen bg-shopify-light">
      <header className="bg-shopify-green text-white p-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl tracking-tight hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white transition">Shopify Dashboard</Link>
        <nav className="flex gap-2 md:gap-4">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1 rounded transition font-medium focus:outline-none focus:ring-2 focus:ring-white/80 hover:bg-white/10 hover:underline ${location.pathname === link.to ? 'bg-white/20 underline' : ''}`}
              aria-current={location.pathname === link.to ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}

export default Layout;
