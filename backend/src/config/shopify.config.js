import axios from 'axios';

// Always use the latest Storefront API version in the endpoint
const SHOPIFY_API_VERSION = '2026-01';
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'bd886b-23.myshopify.com';
const STOREFRONT_API_ENDPOINT = process.env.STOREFRONT_API_ENDPOINT || `https://${SHOPIFY_STORE}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export const storefrontGraphQLClient = axios.create({
  baseURL: STOREFRONT_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': process.env.STOREFRONT_ACCESS_TOKEN,
  },
});
