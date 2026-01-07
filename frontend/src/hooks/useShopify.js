// Example custom hook for Shopify API
import { useQuery } from '@tanstack/react-query';
import { shopifyApi } from '../services/api';

export function useShopInfo() {
  return useQuery(['shopInfo'], shopifyApi.getShopInfo);
}
