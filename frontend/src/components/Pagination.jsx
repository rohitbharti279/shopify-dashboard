import React from 'react';

function Pagination({ hasNextPage, hasPreviousPage, onNext, onPrevious }) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        onClick={onPrevious}
        disabled={!hasPreviousPage}
      >
        Previous
      </button>
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        onClick={onNext}
        disabled={!hasNextPage}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
