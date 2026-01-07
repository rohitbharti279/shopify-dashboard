import React from 'react';

function ProductCard({ product }) {
  const firstImage = product.featuredImage || product.images?.edges?.[0]?.node;

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
      <div className="text-xs text-gray-500">Type: {product.productType || 'N/A'}</div>
      <div className="text-xs text-gray-500">Handle: {product.handle}</div>
      <div className="text-xs text-gray-500">Inventory: {product.totalInventory ?? 'N/A'}</div>
      <div className="text-xs text-gray-500">Created: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}</div>
    </div>
  );
}

export default ProductCard;
