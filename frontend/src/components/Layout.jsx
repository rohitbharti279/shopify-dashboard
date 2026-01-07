import React from 'react';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-shopify-light">
      <header className="bg-shopify-green text-white p-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">Shopify Dashboard</Link>
        <nav className="flex gap-4">
          <Link to="/" className="hover:underline">Dashboard</Link>
          <Link to="/products" className="hover:underline">Products</Link>
          <Link to="/orders" className="hover:underline">Orders</Link>
          <Link to="/analytics" className="hover:underline">Analytics</Link>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}

export default Layout;
