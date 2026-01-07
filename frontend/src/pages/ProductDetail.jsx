
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { shopifyApi } from '../services/api';

function ProductDetail() {
  const { handle } = useParams();

  const [selectedImage, setSelectedImage] = useState(0);
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', handle],
    queryFn: () => shopifyApi.getProduct(handle).then(res => res.data),
    enabled: !!handle,
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error.message}</div>;
  if (!data) return null;

  const { product, similar } = data;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Gallery */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full flex justify-center mb-4">
            <img
              src={product.images[selectedImage]?.url}
              alt={product.images[selectedImage]?.altText || product.title}
              className="rounded-lg shadow-lg object-contain w-full max-h-[420px] bg-white border border-gray-200"
              style={{ maxWidth: 400, minHeight: 320 }}
            />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.altText || product.title}
                className={`rounded border cursor-pointer object-cover w-20 h-20 ${selectedImage === i ? 'ring-2 ring-shopify-green' : 'opacity-80 hover:opacity-100'}`}
                onClick={() => setSelectedImage(i)}
              />
            ))}
          </div>
        </div>
        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-shopify-green mb-2">{product.title}</h1>
          <div className="text-lg text-gray-700 whitespace-pre-line bg-gray-50 rounded p-3 border border-gray-100">
            {product.description}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
            <div><span className="font-semibold">Type:</span> {product.productType}</div>
            <div><span className="font-semibold">Vendor:</span> {product.vendor}</div>
            <div><span className="font-semibold">Created:</span> {new Date(product.createdAt).toLocaleDateString()}</div>
            <div><span className="font-semibold">Updated:</span> {new Date(product.updatedAt).toLocaleDateString()}</div>
            <div><span className="font-semibold">Inventory:</span> {product.totalInventory}</div>
            <div><span className="font-semibold">Price:</span> {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</div>
            <div className="col-span-2"><span className="font-semibold">Options:</span> {product.options?.map(opt => `${opt.name}: ${opt.values.join(', ')}`).join(' | ')}</div>
            {product.tags?.length > 0 && (
              <div className="col-span-2"><span className="font-semibold">Tags:</span> {product.tags.join(', ')}</div>
            )}
          </div>
          <div className="mt-4">
            <div className="font-semibold mb-1">Variants:</div>
            <div className="grid grid-cols-2 gap-2">
              {product.variants.map(variant => (
                <div key={variant.id} className="bg-gray-100 rounded p-2 flex flex-col border border-gray-200">
                  <div className="font-medium">{variant.title}</div>
                  <div className="text-xs text-gray-500">SKU: {variant.sku || 'N/A'}</div>
                  <div className="text-sm">{variant.price.amount} {variant.price.currencyCode} <span className={variant.availableForSale ? 'text-green-600' : 'text-red-600'}>{variant.availableForSale ? '(In Stock)' : '(Out of Stock)'}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Similar Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-shopify-green">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similar.map(sp => (
            <Link
              key={sp.id}
              to={`/products/${sp.handle}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-gray-100 group"
            >
              <img
                src={sp.featuredImage?.edges?.[0]?.node?.url || sp.featuredImage?.url || sp.images?.[0]?.url}
                alt={sp.title}
                className="h-32 w-full object-cover rounded mb-2 group-hover:scale-105 transition"
                style={{ maxWidth: 180 }}
              />
              <div className="font-bold text-center text-gray-800 group-hover:text-shopify-green">{sp.title}</div>
              <div className="text-xs text-gray-500 mb-1">{sp.productType}</div>
              <div className="text-xs text-gray-500">{sp.priceRange?.minVariantPrice?.amount} {sp.priceRange?.minVariantPrice?.currencyCode}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
