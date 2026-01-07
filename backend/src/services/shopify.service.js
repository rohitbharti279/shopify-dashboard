import { storefrontGraphQLClient } from '../config/shopify.config.js';

export class ShopifyService {
  // Only Storefront API: getProducts
  async getProducts(first = 250, after = null) {
    try {
      const query = `
        query getProducts($first: Int, $after: String) {
          products(first: $first, after: $after) {
            edges {
              node {
                id
                title
                handle
                productType
                createdAt
                totalInventory
                # status field removed (not available in Storefront API)
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              endCursor
              startCursor
            }
          }
        }
      `;
      const variables = { first, after };
      const response = await storefrontGraphQLClient.post('', { query, variables });
      // Map the response to match frontend expectations
      const products = response.data.data.products;
      return {
        edges: products.edges.map(edge => {
          const node = edge.node;
          // Remove status from mapping
          return {
            ...node,
            featuredImage: node.images.edges[0]?.node || null
          };
        }),
        pageInfo: products.pageInfo
      };
    } catch (error) {
      throw new Error(
        'GraphQL Errors: ' + JSON.stringify(error.response?.data?.errors || error.message)
      );
    }
  }
}
