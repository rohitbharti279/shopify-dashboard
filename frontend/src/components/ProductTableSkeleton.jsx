import React from 'react';

function ProductTableSkeleton() {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 animate-pulse">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Image', 'Title', 'Handle', 'Type', 'Inventory', 'Created', 'Actions'].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i}>
              <td className="px-6 py-4"><div className="h-10 w-10 bg-gray-200 rounded-md" /></td>
              <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
              <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-100 rounded" /></td>
              <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-100 rounded" /></td>
              <td className="px-6 py-4"><div className="h-4 w-12 bg-gray-100 rounded" /></td>
              <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100 rounded" /></td>
              <td className="px-6 py-4"><div className="h-5 w-5 bg-gray-200 rounded-full mx-auto" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTableSkeleton;
