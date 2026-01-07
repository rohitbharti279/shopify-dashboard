import React from 'react';
import { Link } from 'react-router-dom';

function RecentProducts({ products, clickable }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
      <ul className="divide-y divide-gray-200">
        {products.map((product) => {
          const firstImage = product.featuredImage || product.images?.edges?.[0]?.node;
          const content = (
            <>
              {firstImage && (
                <img
                  src={firstImage.url}
                  alt={firstImage.altText || product.title}
                  className="h-8 w-8 object-cover rounded border border-gray-200"
                />
              )}
              <span className="font-medium text-gray-900 ml-2">{product.title}</span>
              <span className="text-xs text-gray-500 ml-2">Type: {product.productType || 'N/A'}</span>
              <span className="text-xs text-gray-500 ml-2">Inventory: {product.totalInventory ?? 'N/A'}</span>
              <span className="text-xs text-gray-500 ml-2">Created: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}</span>
            </>
          );
          return (
            <li key={product.id} className="py-2 flex items-center gap-2 hover:bg-gray-50 rounded transition">
              {clickable ? (
                <Link
                  to={`/products/${product.handle}`}
                  className="flex items-center w-full group hover:text-shopify-green focus:outline-none"
                >
                  {content}
                </Link>
              ) : content}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecentProducts;
