import React from 'react';

function RecentProducts({ products }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
      <h2 className="text-lg font-semibold mb-2">Recent Products</h2>
      <ul className="divide-y divide-gray-200">
        {products.map((product) => {
          const firstImage = product.images?.edges?.[0]?.node;
          return (
            <li key={product.id} className="py-2 flex items-center gap-2">
              {firstImage && (
                <img
                  src={firstImage.url}
                  alt={firstImage.altText || product.title}
                  className="h-8 w-8 object-cover rounded"
                />
              )}
              <span className="font-medium text-gray-900">{product.title}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RecentProducts;
