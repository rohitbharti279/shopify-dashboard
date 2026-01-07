import { ShopifyService } from '../services/shopify.service.js';

const shopifyService = new ShopifyService();

export const getShopInfo = async (req, res, next) => {
  try {
    const shopInfo = await shopifyService.getShopInfo();
    res.json(shopInfo);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { first = 20, after = null } = req.query;
    const products = await shopifyService.getProducts(parseInt(first), after);
    console.log('BACKEND PRODUCTS DATA:', JSON.stringify(products, null, 2));
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await shopifyService.getProductById(id);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { first = 20, after = null, status = null } = req.query;
    const orders = await shopifyService.getOrders(parseInt(first), after, status);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await shopifyService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
