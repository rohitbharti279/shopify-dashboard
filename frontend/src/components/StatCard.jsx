import React from 'react';

function StatCard({ title, value, icon, trend, trendUp }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border border-gray-100">
      <div className="flex items-center gap-2">
        <div className="text-shopify-green">{icon}</div>
        <span className="text-gray-700 font-semibold">{title}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>{trend}</div>
    </div>
  );
}

export default StatCard;
