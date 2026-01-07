import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, MoreVertical } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

function ProductTable({ products }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Handle</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => {
            const firstImage = product.featuredImage || product.images?.[0];
            return (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {firstImage ? (
                    <img
                      src={firstImage.url}
                      alt={firstImage.altText || product.title}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <span className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">No Image</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.handle}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.productType || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.totalInventory ?? 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/products/${product.handle}`}
                      className="text-gray-400 hover:text-shopify-green"
                      title="View"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
