import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Plus } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductTable from '../components/ProductTable';
import ProductTableSkeleton from '../components/ProductTableSkeleton';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Pagination from '../components/Pagination';
import { shopifyApi } from '../services/api';
import { toast } from 'react-hot-toast';

function Products() {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [cursor, setCursor] = useState(null);
  const [prevCursors, setPrevCursors] = useState([]); // stack for previous pages

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', cursor],
    queryFn: () => shopifyApi.getProducts({ first: 20, after: cursor }),
    keepPreviousData: true,
  });

  const productsPageInfo = productsData?.data?.pageInfo || {};

  const handleNextPage = () => {
    if (productsPageInfo.hasNextPage) {
      setPrevCursors(prev => [...prev, cursor]);
      setCursor(productsPageInfo.endCursor);
    }
  };

  const handlePreviousPage = () => {
    if (prevCursors.length > 0) {
      const prev = [...prevCursors];
      const lastCursor = prev.pop();
      setPrevCursors(prev);
      setCursor(lastCursor ?? null);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(`Error loading products: ${error.message}`);
    }
  }, [error]);

  const products = productsData?.data?.products || [];

  // Debug logs to diagnose data issues
  if (!isLoading && !error) {
    console.log('productsData:', productsData);
    console.log('products:', products);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <button className="bg-shopify-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
        {viewMode === 'table' ? (
          <ProductTableSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}
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



  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          className="w-full sm:w-auto bg-shopify-green text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shopify-green"
          aria-label="Add Product"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Product
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            aria-label="Search products"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-shopify-green focus:border-transparent focus:outline-none text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 mt-2 md:mt-0">
          <button
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shopify-green"
            aria-label="Filter products"
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            <span className="hidden xs:inline">Filter</span>
          </button>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden w-full sm:w-auto">
            <button
              className={`flex-1 px-4 py-2 ${viewMode === 'table' ? 'bg-gray-100' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shopify-green text-sm md:text-base`}
              aria-pressed={viewMode === 'table'}
              aria-label="Show as table"
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
            <button
              className={`flex-1 px-4 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shopify-green text-sm md:text-base`}
              aria-pressed={viewMode === 'grid'}
              aria-label="Show as grid"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center" role="status" aria-live="polite">
          <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4">
            <rect width="64" height="64" rx="16" fill="#F6F6F7" />
            <path d="M20 44V28a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v16" stroke="#008060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="24" y="32" width="16" height="8" rx="2" fill="#E5E7EB" />
          </svg>
          <h2 className="text-lg font-semibold mb-2">No products found</h2>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters, or add a new product to get started.</p>
          <button
            className="bg-shopify-green text-white px-4 py-2 rounded hover:bg-green-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shopify-green"
            aria-label="Add Product"
          >
            Add Product
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <ProductTable products={products} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {products.length > 0 && (
        <Pagination
          hasNextPage={productsPageInfo.hasNextPage}
          hasPreviousPage={prevCursors.length > 0}
          onNext={handleNextPage}
          onPrevious={handlePreviousPage}
        />
      )}
    </div>
  );
}

export default Products;
