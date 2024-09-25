export const api_urls = [
  {
    environment: "production",
    name: "categories",
    url: "https://www.tangiblelabs.com/categories.json",
  }, 
  {
    environment: "production",
    name: "products",
    url: "https://www.tangiblelabs.com/products.json?category=",
  },
{
  environment: "development",
    name: "categories",
    url: "http://localhost:3000/categories.json",
  }, 
  {
    environment: "development",
    name: "products",
    url: "http://localhost:3000/products.json?category=",
  },
]