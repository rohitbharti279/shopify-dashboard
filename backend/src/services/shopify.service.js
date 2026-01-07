import { storefrontGraphQLClient } from '../config/shopify.config.js';

export class ShopifyService {

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
                productType
                createdAt
                totalInventory
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

        const products = response.data.data.products;

        // Map products
        const mappedProducts = products.edges.map(edge => {
          const node = edge.node;
          return {
            ...node,
            featuredImage: node.images.edges[0]?.node || null
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
