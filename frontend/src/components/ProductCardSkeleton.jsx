import React from 'react';

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-100 flex flex-col gap-2 animate-pulse">
      <div className="h-32 w-full bg-gray-200 rounded mb-2" />
      <div className="h-5 w-2/3 bg-gray-200 rounded mb-1" />
      <div className="h-3 w-1/2 bg-gray-100 rounded mb-1" />
      <div className="h-3 w-1/3 bg-gray-100 rounded mb-1" />
      <div className="h-3 w-1/4 bg-gray-100 rounded" />
    </div>
  );
}

export default ProductCardSkeleton;
