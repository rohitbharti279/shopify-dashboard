import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductTable from '../components/ProductTable';
import { shopifyApi } from '../services/api';

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

  console.log('FRONTEND productsData:', productsData);
  const products = productsData?.data?.edges || [];
  console.log('FRONTEND products:', products);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Products (Dashboard)</h1>
      <ProductTable products={products} />
    </div>
  );
}

export default Dashboard;
