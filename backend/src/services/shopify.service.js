
  import { storefrontGraphQLClient } from '../config/shopify.config.js';

  export class ShopifyService {
  async getProductByHandle(handle) {
    const query = `
      query getProduct($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          productType
          vendor
          createdAt
          updatedAt
          tags
          totalInventory
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                sku
                price { amount currencyCode }
                availableForSale
              }
            }
          }
          images(first: 50) {
            edges {
              node {
                url
                altText
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    `;
    const variables = { handle };
    const response = await storefrontGraphQLClient.post('', { query, variables });
    if (response.data.errors) {
      throw new Error('Shopify GraphQL error: ' + JSON.stringify(response.data.errors));
    }
    const product = response.data.data.productByHandle;
    if (!product) throw new Error('Product not found');
    return {
      ...product,
      images: product.images.edges.map(imgEdge => imgEdge.node),
      variants: product.variants?.edges?.map(v => v.node) || [],
    };
  }

  async getSimilarProducts(productType, excludeHandle, first = 4) {
    const query = `
      query getProducts($first: Int!, $productType: String!) {
        products(first: $first, query: $productType) {
          edges {
            node {
              id
              title
              handle
              productType
              featuredImage: images(first: 1) { edges { node { url altText } } }
            }
          }
        }
      }
    `;
    const variables = { first: first + 1, productType: `product_type:${productType}` };
    const response = await storefrontGraphQLClient.post('', { query, variables });
    if (response.data.errors) {
      throw new Error('Shopify GraphQL error: ' + JSON.stringify(response.data.errors));
    }
    let products = response.data.data.products.edges.map(edge => edge.node);
    // Exclude the current product
    products = products.filter(p => p.handle !== excludeHandle).slice(0, first);
    return products;
  }

  async getProducts(first = 250) {
    try {
      const query = `
        query getProducts($first: Int!, $after: String) {
          products(first: $first, after: $after) {
            edges {
              node {
                id
                title
                handle
                description
                productType
                vendor
                createdAt
                updatedAt
                tags
                totalInventory
                priceRange {
                  minVariantPrice { amount currencyCode }
                  maxVariantPrice { amount currencyCode }
                }
                variants(first: 50) {
                  edges {
                    node {
                      id
                      title
                      sku
                      price { amount currencyCode }
                      availableForSale
                    }
                  }
                }
                images(first: 50) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                options {
                  name
                  values
                }
                # metafields removed: Storefront API requires identifiers and does not support 'first' or 'edges' here
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      let allProducts = [];
      let hasNextPage = true;
      let after = null;

      while (hasNextPage) {
        const variables = { first, after };

        const response = await storefrontGraphQLClient.post('', {
          query,
          variables
        });

        // Debug: log raw response
        console.log('Shopify raw response:', JSON.stringify(response.data, null, 2));

        if (response.data.errors) {
          throw new Error('Shopify GraphQL error: ' + JSON.stringify(response.data.errors));
        }

        if (!response.data.data || !response.data.data.products) {
          throw new Error('Shopify response missing products: ' + JSON.stringify(response.data));
        }

        const products = response.data.data.products;

        // Map products
        const mappedProducts = products.edges.map(edge => {
          const node = edge.node;
          // featuredImage for table/grid, all images for detail
          return {
            ...node,
            featuredImage: node.images.edges[0]?.node || null,
            images: node.images.edges.map(imgEdge => imgEdge.node),
            variants: node.variants?.edges?.map(v => v.node) || [],
            metafields: node.metafields?.edges?.map(m => m.node) || [],
          };
        });

        allProducts.push(...mappedProducts);

        hasNextPage = products.pageInfo.hasNextPage;
        after = products.pageInfo.endCursor;
      }

      return {
        products: allProducts,
        total: allProducts.length
      };

    } catch (error) {
      throw new Error(
        'GraphQL Errors: ' +
          JSON.stringify(error.response?.data?.errors || error.message)
      );
    }
  }
}
