import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Plus } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductTable from '../components/ProductTable';
import Pagination from '../components/Pagination';
import { shopifyApi } from '../services/api';

function Products() {
    // ...existing code...
    // Place debug logs after all variables are initialized
    // Debug logs to diagnose data issues
    // Only log after isLoading and error are defined
    // This should be placed after products, productsPageInfo are defined
    // See below for correct placement
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [pageInfo, setPageInfo] = useState({});
  const [cursor, setCursor] = useState(null);

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', cursor],
    queryFn: () => shopifyApi.getProducts({ first: 20, after: cursor }),
  });

  const handleNextPage = () => {
    if (productsData?.pageInfo?.hasNextPage) {
      setCursor(productsData.pageInfo.endCursor);
    }
  };

  const handlePreviousPage = () => {
    // Note: For previous page you need to implement a cursor stack
    // or use the GraphQL `before` parameter
  };

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
  // If you have pagination info, update this line accordingly
  const productsPageInfo = productsData?.data?.pageInfo || {};

  // Debug logs to diagnose data issues
  if (!isLoading && !error) {
    console.log('productsData:', productsData);
    console.log('products:', products);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button className="bg-shopify-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-shopify-green focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              className={`px-4 py-2 ${viewMode === 'table' ? 'bg-gray-100' : 'bg-white'}`}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
            <button
              className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        <ProductTable products={products} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination
        hasNextPage={productsPageInfo.hasNextPage}
        hasPreviousPage={productsPageInfo.hasPreviousPage}
        onNext={handleNextPage}
        onPrevious={handlePreviousPage}
      />
    </div>
  );
}

export default Products;
