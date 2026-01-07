import express from 'express';
import {
  getShopInfo,
  getProducts,
  getProduct,
  getOrders,
  getDashboardStats
} from '../controllers/shopify.controller.js';

const router = express.Router();

// Shopify API routes
router.get('/shop', getShopInfo);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/orders', getOrders);
router.get('/dashboard', getDashboardStats);

export default router;
