import axios from 'axios';

// Debug: Print env variables to diagnose undefined issue
console.log('DEBUG ENV STOREFRONT_API_ENDPOINT:', process.env.STOREFRONT_API_ENDPOINT);
console.log('DEBUG ENV STOREFRONT_ACCESS_TOKEN:', process.env.STOREFRONT_ACCESS_TOKEN);

export const storefrontGraphQLClient = axios.create({
  baseURL: process.env.STOREFRONT_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': process.env.STOREFRONT_ACCESS_TOKEN,
  },
});
