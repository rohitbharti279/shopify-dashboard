import React from 'react';

function ProductCard({ product }) {
  // Get the first image if available
  const firstImage = product.images?.edges?.[0]?.node;

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-100 flex flex-col gap-2">
      {firstImage && (
        <img
          src={firstImage.url}
          alt={firstImage.altText || product.title}
          className="h-32 w-full object-cover rounded"
        />
      )}
      <div className="font-bold text-gray-900">{product.title}</div>
      <div className="text-xs text-gray-500">{product.productType || 'N/A'}</div>
      {/* You can add more fields as needed */}
    </div>
  );
}

export default ProductCard;
