import { api_urls } from  "./_api_urls.js";

const environment = import.meta.env.VITE_RUN_ENVIRONMENT || 'development';

export const categories_url = api_urls.find((u) =>  u.name == 'categories' && u.environment == environment ).url;

export const products_url = api_urls.find((u) => u.name == 'products' && u.environment == environment ).url;

export const catalog_url = api_urls.find((u) => u.name == 'catalog' && u.environment == environment ).url;
