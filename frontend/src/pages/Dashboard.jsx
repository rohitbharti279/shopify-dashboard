import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StatCard from '../components/StatCard';
import RecentProducts from '../components/RecentProducts';
import RevenueChart from '../components/RevenueChart';
import ProductTable from '../components/ProductTable';
import { shopifyApi } from '../services/api';
import { Package, Boxes, TrendingUp } from 'lucide-react';

function Dashboard() {
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['dashboardProducts'],
    queryFn: () => shopifyApi.getProducts({ first: 20 }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shopify-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading products: {error.message}</p>
      </div>
    );
  }

  const products = productsData?.data?.products || [];
  // Calculate stats
  const totalProducts = products.length;
  const totalInventory = products.reduce((sum, p) => sum + (p.totalInventory ?? 0), 0);
  // Recent products (last 5)
  const recentProducts = products.slice(0, 5);

  // Find most common product type
  const typeCounts = products.reduce((acc, p) => {
    acc[p.productType] = (acc[p.productType] || 0) + 1;
    return acc;
  }, {});
  const mostCommonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Find newest product
  const newestProduct = products.reduce((latest, p) => {
    return (!latest || new Date(p.createdAt) > new Date(latest.createdAt)) ? p : latest;
  }, null);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package size={32} />}
          trend={totalProducts > 0 ? '+ New arrivals' : 'No products'}
          trendUp={true}
        />
        <StatCard
          title="Total Inventory"
          value={totalInventory}
          icon={<Boxes size={32} />}
          trend={totalInventory > 0 ? 'Stock available' : 'No stock'}
          trendUp={totalInventory > 0}
        />
        <StatCard
          title="Most Common Type"
          value={mostCommonType}
          icon={<Boxes size={32} />}
          trend={typeCounts[mostCommonType] ? `${typeCounts[mostCommonType]} products` : 'N/A'}
          trendUp={true}
        />
      </div>

      {/* Interesting: Newest Product */}
      {newestProduct && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">Newest Product</h2>
          <div className="flex items-center gap-4">
            {newestProduct.featuredImage && (
              <img
                src={newestProduct.featuredImage.url}
                alt={newestProduct.featuredImage.altText || newestProduct.title}
                className="h-16 w-16 object-cover rounded"
              />
            )}
            <div>
              <div className="font-bold text-gray-900">{newestProduct.title}</div>
              <div className="text-xs text-gray-500">Type: {newestProduct.productType || 'N/A'}</div>
              <div className="text-xs text-gray-500">Inventory: {newestProduct.totalInventory ?? 'N/A'}</div>
              <div className="text-xs text-gray-500">Created: {new Date(newestProduct.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Products */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Products</h2>
        <RecentProducts products={recentProducts} />
        <a
          href="/products"
          className="inline-block mt-4 px-4 py-2 bg-shopify-green text-white rounded hover:bg-green-700 text-sm font-medium"
        >
          View All Products
        </a>
      </div>
    </div>
  );
}

export default Dashboard;
