import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const firstImage = product.featuredImage || product.images?.edges?.[0]?.node;

  return (
    <Link
      to={`/products/${product.handle}`}
      className="bg-white rounded-lg shadow p-4 border border-gray-100 flex flex-col gap-2 hover:shadow-lg hover:border-shopify-green group transition focus:outline-none focus:ring-2 focus:ring-shopify-green"
      tabIndex={0}
      aria-label={`View details for ${product.title}`}
    >
      {firstImage && (
        <img
          src={firstImage.url}
          alt={firstImage.altText || product.title}
          className="h-32 w-full object-cover rounded mb-2 group-hover:scale-105 transition"
        />
      )}
      <div className="font-bold text-gray-900 group-hover:text-shopify-green transition">{product.title}</div>
      <div className="text-xs text-gray-500">Type: {product.productType || 'N/A'}</div>
      <div className="text-xs text-gray-500">Inventory: {product.totalInventory ?? 'N/A'}</div>
      <div className="text-xs text-gray-500">Created: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}</div>
    </Link>
  );
}

export default ProductCard;
