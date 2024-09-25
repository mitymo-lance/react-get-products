import { api_urls } from  "./_api_urls.js";

export const categories_url = api_urls.find((u) =>  u.name == 'categories' && u.environment == 'development' ).url;
export const products_url = api_urls.find((u) => u.name == 'products' && u.environment == 'development' ).url;
